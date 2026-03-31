import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { downVote, getPostsById, upVote } from "../../api/post/post";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useForm } from "react-hook-form";
import { CiBookmark, CiHeart } from "react-icons/ci";
import CommentBox from "../../components/widgets/CommentBox";
import { useKeycloak } from "@react-keycloak/web";
import { addComment, getCommentByPostId } from "../../api/comment/comment";
import { converterTimeToOnlyDate } from "../../utils/handleTimeShow";
import { toast, ToastContainer } from "react-toastify";
import { BsCaretUp, BsCaretDown, BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { GoComment } from "react-icons/go";
import { CiShare2 } from "react-icons/ci";
import DOMPurify from 'dompurify';
import useTrackPostView from "../../utils/useTrackPostView";
import { CiLink } from "react-icons/ci";
import { FaFacebook, FaRegEye } from "react-icons/fa";
import { getUserInfoById } from "../../api/user/user";
import useAuthGuard from "../../hooks/useAuthGuard";

const PostDetailPage = () => {
    const { postId, slug } = useParams();
    const { handleSubmit, control, register, reset } = useForm({
        defaultValues: { postId: null, authorId: null, content: null, upperCommentId: null }
    });
    
    const { requireLogin } = useAuthGuard();
    const { keycloak, initialized } = useKeycloak();
    const [userInfo, setUserInfo] = useState(null);
    const [authorPostInfo, setAuthorPostInfo] = useState(null);
    const [dataPost, setDataPost] = useState(null);
    const [cleanHTMLContent, setCleanHTMLContent] = useState(null);
    const [point, setPoint] = useState(0);
    const [openShare, setOpenShare] = useState(false);
    const [usersVoted, setUsersVoted] = useState(null);
    const [hideSticky, setHideSticky] = useState(false);

    const postToolBarRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setHideSticky(entry.isIntersecting);
            },
            {
                root: null, // viewport
                threshold: 0.05, // thấy 10% là trigger
            }
        );

        if (postToolBarRef.current) {
            observer.observe(postToolBarRef.current);
        }

        return () => {
            if (postToolBarRef.current) {
                observer.unobserve(postToolBarRef.current);
            }
        };
    }, []);

    // 1 hot - 2 new
    const [commentHot, setCommnetHot] = useState(true);
    const [dataComments, setDataComments] = useState([]);

    const getDataPost = async () => {
        const result = await getPostsById(postId);
        setDataPost(result.value);
        setPoint(result.value.point);
        setUsersVoted(result.value.postVotes);
    }

    useEffect(() => {
        if (postId) {
            getDataPost();
            getDataComments(postId);
        }
    }, [postId]);

    useEffect(() => {
        document.title = dataPost?.title;
    }, [dataPost]);

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            setUserInfo(keycloak?.tokenParsed);
        }
        if (initialized && !keycloak.authenticated) {
            setUserInfo(null);
        }
    }, [initialized, keycloak]);

    const sendComment = async (data) => {
        data.postId = postId;
        data.authorId = userInfo?.sub;
        let response = await addComment(data);
        setDataComments(prev => [response, ...prev]);
        reset();
        toast.success("Thêm bình luận thành công!");
    }

    const getDataComments = async (postId) => {
        // setDataComments(dataComment);
        var response = await getCommentByPostId(postId, commentHot);
        // console.log(response);
        setDataComments(response);
    }

    useEffect(() => {
        getDataComments(postId);
    }, [commentHot]);

    useEffect(() => {
        if (dataPost)
        {
            setCleanHTMLContent(DOMPurify.sanitize(dataPost.content));
        }
    }, [dataPost]);

    const fetchAuthorInfo = async () => {
        if (dataPost) {
            var response = await getUserInfoById(dataPost?.authorId);
            setAuthorPostInfo(response);
        }
    }

    useEffect(() => {
        fetchAuthorInfo();
    }, [dataPost]);

    const postContentRef = useRef(null);
    const { isTimePassed, isScrolled, hasCounted } = useTrackPostView(dataPost?.postId, postContentRef);

    const commentSectionRef = useRef(null);

    const handleUpVote = async () => {
        if (!requireLogin()) return;

        const data = {
            postId: dataPost?.postId,
            userId: userInfo?.sub
        }
        try {
            const response = await upVote(data);
            setPoint(response.point);
        }
        catch (err) {
            toast.error("Đã xảy ra lỗi!")
        }
    }

    const handleDownVote = async () => {
        if (!requireLogin()) return;
        
        const data = {
            postId: dataPost?.postId,
            userId: userInfo?.sub
        }
        try {
            const response = await downVote(data);
            setPoint(response.point);
        }
        catch (err) {
            toast.error("Đã xảy ra lỗi!")
        }
    }

    const handleCopyLink = async () => {
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);
            toast.success("Đã sao chép đường dẫn thành công");
        }
        catch {
            toast.error("Không thể sao chép liên kết. Vui lòng thử lại!");
        }
    }

    const handleFacebookShare = () => {
        const currentUrl = window.location.href;

        const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        window.open(
            fbShareUrl,
            'facebook-share-dialog',
            `width=${width},height=${height},top=${top},left=${left}`
        );
    };

    const checkUserUpVotedPost = () => {
        const userId = userInfo?.sub;
        if (usersVoted && userId) {
            for (let e = 0; e < usersVoted.length; e++) {
                const v = usersVoted[e];
                if (v.userId === userId && v.typeVote === 1) {
                    return true;
                }
            }
        }
        return false;
    }

    const checkUserDownVotedPost = () => {
        const userId = userInfo?.sub;
        if (usersVoted && userId) {
            for (let e = 0; e < usersVoted.length; e++) {
                const v = usersVoted[e];
                if (v.userId === userId && v.typeVote === 2) {
                    return true;
                }
            }
        }
        return false;
    }

    useEffect(() => {
        checkUserUpVotedPost();
        checkUserDownVotedPost();
    }, [userInfo]);

    return (
        <div className="relative">
            <div className={`
                fixed left-[16%] top-[30%] bg-red-000 w-20 min-h-74 flex flex-col justify-center items-center gap-4 text-2xl text-gray-600
                ${hideSticky ? "-translate-x-20 opacity-0" : "translate-x-0 opacity-100"}
            `}>
                <div className="content-center">
                    {checkUserUpVotedPost()
                        ? <BsCaretUpFill
                            className="fill-green-500 cursor-pointer hover:scale-125"
                            onClick={() => handleUpVote()}
                        />
                        : <BsCaretUp
                            className="cursor-pointer hover:scale-125"
                            onClick={() => handleUpVote()}
                        />
                    }
                    <div className="text-center">{point}</div>
                    {checkUserDownVotedPost()
                        ? <BsCaretDownFill
                            className="fill-green-500 cursor-pointer hover:scale-125"
                            onClick={() => handleUpVote()}
                        />
                        : <BsCaretDown
                            className="cursor-pointer hover:scale-125"
                            onClick={() => handleUpVote()}
                        />
                    }
                </div>
                <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='avatar' className='h-11 w-11 rounded-full' />
                <CiBookmark className="text-3xl"/>
                <GoComment 
                    onClick={() => {
                        commentSectionRef?.current?.scrollIntoView({ behavior: 'smooth' })
                    }}
                />
                <CiShare2 className=""
                    onClick={() => {
                        if (!openShare) {
                            setOpenShare(true)
                        }
                        else {
                            setOpenShare(false)
                        }
                    }}
                />

                {openShare && <div className="border-t-[1px] border-gray-400 w-16 flex gap-3 pt-2">
                    <FaFacebook 
                        onClick={() => handleFacebookShare()}
                    />

                    <CiLink 
                        onClick={() => handleCopyLink()}
                    />
                </div>}
            </div>
            <div className="container-app pl-[25%] pr-[25%]">
                <div className="text-gray-500 flex justify-between">
                    <div>{dataPost?.category?.name}</div>
                </div>

                <div className="font-semibold text-xl">
                    {dataPost?.title}
                </div>
                <div className='flex gap-x-2 items-center'>
                    <img src={`${authorPostInfo?.avatarUrl}`} alt='avatar' className='h-11 w-11 rounded-full' />
                    <div>
                        <h3 className='font-semibold'>
                            {authorPostInfo?.firstName} {authorPostInfo?.lastName}
                        </h3>
                        <h3 data-tooltip-id='my-tooltip-date' className="text-gray-500 w-fit">{converterTimeToOnlyDate(dataPost?.createdAt)}</h3>
                        <ReactTooltip
                            id='my-tooltip-date'
                            place='bottom'
                            content='01/01/2025'
                        >

                        </ReactTooltip>
                    </div>
                </div>

                {/* Content */}
                <div
                    ref={postContentRef}
                >
                    <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: cleanHTMLContent}} />
                </div>

                {/* Post Tags */}
                <div className="flex gap-2 text-xs mt-10">
                    {dataPost?.postTags.map(pt => {
                        return <div
                            className="bg-gray-100 p-3 w-fit rounded-md hover:bg-gray-200"
                        >
                            {pt.tagName}
                        </div>
                    })}
                    
                </div>

                <div ref={postToolBarRef}>
                    <div
                        className="flex items-stretch py-2"
                    >
                        <div className="flex gap-5">
                            <div className="content-center flex gap-1 items-center bg-gray-200 rounded-3xl p-2">
                                {checkUserUpVotedPost()
                                    ? <BsCaretUpFill
                                        className="text-2xl fill-green-500 cursor-pointer hover:scale-125"
                                        onClick={() => handleUpVote()}
                                    />
                                    : <BsCaretUp
                                        className="text-2xl tcursor-pointer hover:scale-125"
                                        onClick={() => handleUpVote()}
                                    />
                                }
                                <div className="text-center">{point}</div>
                                {checkUserDownVotedPost()
                                    ? <BsCaretDownFill
                                        className="text-2xl fill-green-500 cursor-pointer hover:scale-125"
                                        onClick={() => handleUpVote()}
                                    />
                                    : <BsCaretDown
                                        className="text-2xl cursor-pointer hover:scale-125"
                                        onClick={() => handleUpVote()}
                                    />
                                }
                            </div>

                            <div className="flex gap-1 items-center bg-gray-200 rounded-3xl py-2 px-3">
                                <GoComment />
                                <div>30</div>
                            </div>

                            <div className="flex gap-1 items-center bg-gray-200 rounded-3xl py-2 px-3">
                                <FaRegEye />
                                <div>{dataPost?.viewCount}</div>
                            </div>
                        </div>
                        <hr />
                        <div>
                            
                        </div>
                    </div>

                    {/* comment */}
                    <div className="border border-[1px] border-gray-400 rounded-lg my-2 p-5">
                        <form onSubmit={handleSubmit(sendComment)}>
                            <div className="flex justify-between items-start">
                                <textarea
                                    className="w-full h-24 border border-none rounded-md p-2 focus:outline-none resize-none"
                                    placeholder="Bình luận"
                                    {...register("content")}
                                />
                                <button
                                    type="submit"
                                    className="py-2 px-3 font-semibold"
                                >
                                    Gửi
                                </button>
                            </div>
                        </form>
                        <hr />
                        <div>
                            <div className="text-right">
                                <button
                                    className={`${commentHot ? 'text-blue-500 font-bold' : ''} p-2`}
                                    onClick={() => setCommnetHot(true)}
                                >
                                    Hot nhất
                                </button>
                                <button
                                    className={`${!commentHot ? 'text-blue-500 font-bold' : ''} p-2`}
                                    onClick={() => setCommnetHot(false)}
                                >
                                    Mới nhất
                                </button>
                            </div>

                            <div
                                id="comment-section"
                                ref={commentSectionRef}
                            >
                                {dataComments && dataComments.length > 0 && (
                                    <div>
                                        {dataComments.map((cmt) => (
                                            <div
                                                key={cmt.commentId}
                                                className="mb-6"
                                            >
                                                <CommentBox key={cmt.commentId} comment={cmt} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default PostDetailPage;