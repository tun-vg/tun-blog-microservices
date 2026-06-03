import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { addBookMark, checkUserBookMarkPost, downVote, getPostsById, removeBookMark, upVote } from "../../api/post/post";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useForm } from "react-hook-form";
import { CiBookmark, CiHeart } from "react-icons/ci";
import CommentBox from "../../components/widgets/CommentBox";
import { useKeycloak } from "@react-keycloak/web";
import { addComment, getCommentByPostId } from "../../api/comment/comment";
import { converterTimeToOnlyDate } from "../../utils/handleTimeShow";
import { toast, ToastContainer } from "react-toastify";
import { BsCaretUp, BsCaretDown, BsCaretUpFill, BsCaretDownFill } from "react-icons/bs";
import { GoBookmark, GoBookmarkFill, GoComment } from "react-icons/go";
import { CiShare2 } from "react-icons/ci";
import DOMPurify from 'dompurify';
import useTrackPostView from "../../utils/useTrackPostView";
import { CiLink } from "react-icons/ci";
import { FaFacebook, FaRegEye } from "react-icons/fa";
import { getUserInfoById } from "../../api/user/user";
import useAuthGuard from "../../utils/useAuthGuard";

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
    const [userBookMarkPost, setUserBookMarkPost] = useState(false);
    const [userUpVotedPost, setUserUpVotedPost] = useState(false);
    const [userDownVotedPost, setUserDownVotedPost] = useState(false);

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
        var response = await getCommentByPostId(postId, commentHot);
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
            userId: userInfo?.sub,
            action: userUpVotedPost ? 3 : 1
        }
        try {
            const response = await upVote(data);
            setPoint(response.point);
            setUserUpVotedPost(!userUpVotedPost);
            setUserDownVotedPost(false);
        }
        catch (err) {
            toast.error("Đã xảy ra lỗi!");
        }
    }

    const handleDownVote = async () => {
        if (!requireLogin()) return;
        
        const data = {
            postId: dataPost?.postId,
            userId: userInfo?.sub,
            action: userDownVotedPost ? 4 : 2
        }
        try {
            const response = await downVote(data);
            setPoint(response.point);
            setUserUpVotedPost(false);
            setUserDownVotedPost(!userDownVotedPost);
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
                    setUserUpVotedPost(true);
                }
            }
        }
    }

    const checkUserDownVotedPost = () => {
        const userId = userInfo?.sub;
        if (usersVoted && userId) {
            for (let e = 0; e < usersVoted.length; e++) {
                const v = usersVoted[e];
                if (v.userId === userId && v.typeVote === 2) {
                    setUserDownVotedPost(true);
                }
            }
        }
    }

    useEffect(() => {
        checkUserUpVotedPost();
        checkUserDownVotedPost();
    }, [userInfo, usersVoted]);


    const handleAddBookMarkPost = async () => {
        if (!requireLogin()) return;

        const request = {
            postId: postId,
            userId: userInfo?.sub
        }

        const response = await addBookMark(request);
        if (response) {
            setUserBookMarkPost(true)
        }
    }

    const handleRemoveBookMarkPost = async () => {
        if (!requireLogin()) return;

        const request = {
            postId: postId,
            userId: userInfo?.sub
        }

        const response = await removeBookMark(request);
        if (response) {
            setUserBookMarkPost(false);
        }
    }


    const handleCheckUserBookMarkPost = async () => {
        const request = {
            postId: postId,
            userId: userInfo?.sub
        }
        const response  = await checkUserBookMarkPost(request);
        setUserBookMarkPost(response);
    }

    useEffect(() => {
        if (userInfo){
            handleCheckUserBookMarkPost();
        }
    }, [userInfo])

    const tagColors = [
        'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
        'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
        'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
        'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
    ];

    return (
        <div className="relative bg-gray-50 min-h-screen">
            {/* Floating action sidebar — desktop only */}
            <div className={`
                hidden xl:flex
                fixed left-[calc(50%-680px)] top-1/2 -translate-y-1/2
                flex-col items-center gap-3
                transition-all duration-300
                ${hideSticky ? "-translate-x-16 opacity-0 pointer-events-none" : "translate-x-0 opacity-100"}
            `}>
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col items-center py-3 px-2 gap-1">
                    <button
                        onClick={handleUpVote}
                        className={`p-2 rounded-xl transition-colors ${userUpVotedPost ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:bg-gray-100 hover:text-green-500'}`}
                    >
                        {userUpVotedPost ? <BsCaretUpFill className="text-xl" /> : <BsCaretUp className="text-xl" />}
                    </button>
                    <span className="text-sm font-bold text-gray-700">{point}</span>
                    <button
                        onClick={handleDownVote}
                        className={`p-2 rounded-xl transition-colors ${userDownVotedPost ? 'text-orange-500 bg-orange-50' : 'text-gray-400 hover:bg-gray-100 hover:text-orange-500'}`}
                    >
                        {userDownVotedPost ? <BsCaretDownFill className="text-xl" /> : <BsCaretDown className="text-xl" />}
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col items-center py-3 px-2 gap-2">
                    <button
                        onClick={() => commentSectionRef?.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-blue-500 transition-colors"
                        title="Bình luận"
                    >
                        <GoComment className="text-xl" />
                    </button>

                    <button
                        onClick={userBookMarkPost ? handleRemoveBookMarkPost : handleAddBookMarkPost}
                        className={`p-2 rounded-xl transition-colors ${userBookMarkPost ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100 hover:text-yellow-500'}`}
                        title="Lưu bài"
                    >
                        {userBookMarkPost ? <GoBookmarkFill className="text-xl" /> : <GoBookmark className="text-xl" />}
                    </button>

                    <button
                        onClick={() => setOpenShare(v => !v)}
                        className={`p-2 rounded-xl transition-colors ${openShare ? 'text-blue-500 bg-blue-50' : 'text-gray-400 hover:bg-gray-100 hover:text-blue-500'}`}
                        title="Chia sẻ"
                    >
                        <CiShare2 className="text-xl" />
                    </button>

                    {openShare && (
                        <div className="flex flex-col gap-1 pt-1 border-t border-gray-100 w-full items-center">
                            <button
                                onClick={handleFacebookShare}
                                className="p-2 rounded-xl text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                title="Chia sẻ Facebook"
                            >
                                <FaFacebook className="text-lg" />
                            </button>
                            <button
                                onClick={handleCopyLink}
                                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                title="Sao chép liên kết"
                            >
                                <CiLink className="text-xl" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Post header */}
                    <div className="px-4 sm:px-8 md:px-10 pt-6 sm:pt-10 pb-5 sm:pb-6">
                        {dataPost?.category?.name && (
                            <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-4">
                                {dataPost.category.name}
                            </span>
                        )}

                        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-6">
                            {dataPost?.title}
                        </h1>

                        <div className='flex gap-x-3 items-center'>
                            <img
                                src={authorPostInfo?.avatarUrl || '/user.webp'}
                                alt='avatar'
                                className='h-12 w-12 rounded-full object-cover ring-2 ring-amber-100 shadow-sm'
                            />
                            <div>
                                <h3 className='font-semibold text-gray-900'>
                                    {authorPostInfo?.firstName} {authorPostInfo?.lastName}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span data-tooltip-id='my-tooltip-date'>{converterTimeToOnlyDate(dataPost?.createdAt)}</span>
                                    {dataPost?.readingTime && (
                                        <>
                                            <span>·</span>
                                            <span>{dataPost.readingTime} phút đọc</span>
                                        </>
                                    )}
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <FaRegEye className="text-xs" />
                                        {dataPost?.viewCount}
                                    </span>
                                </div>
                                <ReactTooltip id='my-tooltip-date' place='bottom' content={dataPost?.createdAt} />
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100" />

                    {/* Content */}
                    <div className="px-4 sm:px-8 md:px-10 py-5 sm:py-8" ref={postContentRef}>
                        <div
                            className="prose prose-lg prose-gray max-w-none
                                prose-headings:font-bold prose-headings:text-gray-900
                                prose-p:text-gray-700 prose-p:leading-relaxed
                                prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
                                prose-blockquote:border-l-amber-400 prose-blockquote:bg-amber-50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
                                prose-code:bg-gray-100 prose-code:text-amber-700 prose-code:px-1 prose-code:rounded"
                            dangerouslySetInnerHTML={{ __html: cleanHTMLContent }}
                        />
                    </div>

                    {/* Post Tags */}
                    {dataPost?.postTags?.length > 0 && (
                        <div className="px-4 sm:px-8 md:px-10 pb-5 sm:pb-6 flex flex-wrap gap-2">
                            {dataPost.postTags.map((pt, idx) => (
                                <span
                                    key={pt.tagId}
                                    className={`text-xs font-medium border rounded-full px-3 py-1 cursor-pointer transition-colors ${tagColors[idx % tagColors.length]}`}
                                >
                                    #{pt.tagName}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action toolbar */}
                    <div ref={postToolBarRef} className="border-t border-gray-100 px-4 sm:px-8 md:px-10 py-3 sm:py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-3">
                                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5">
                                    <button
                                        onClick={handleUpVote}
                                        className={`transition-colors ${userUpVotedPost ? 'text-green-500' : 'text-gray-400 hover:text-green-500'}`}
                                    >
                                        {userUpVotedPost ? <BsCaretUpFill className="text-lg" /> : <BsCaretUp className="text-lg" />}
                                    </button>
                                    <span className="text-sm font-semibold text-gray-700 px-1">{point}</span>
                                    <button
                                        onClick={handleDownVote}
                                        className={`transition-colors ${userDownVotedPost ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}
                                    >
                                        {userDownVotedPost ? <BsCaretDownFill className="text-lg" /> : <BsCaretDown className="text-lg" />}
                                    </button>
                                </div>

                                <button
                                    onClick={() => commentSectionRef?.current?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                                >
                                    <GoComment className="text-base" />
                                    <span>{dataComments?.length ?? 0}</span>
                                </button>

                                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-400 text-sm">
                                    <FaRegEye className="text-base" />
                                    <span>{dataPost?.viewCount}</span>
                                </div>
                            </div>

                            <button
                                onClick={userBookMarkPost ? handleRemoveBookMarkPost : handleAddBookMarkPost}
                                className={`p-2 rounded-full transition-colors ${userBookMarkPost ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                title={userBookMarkPost ? 'Bỏ lưu' : 'Lưu bài'}
                            >
                                {userBookMarkPost
                                    ? <GoBookmarkFill className="text-xl" />
                                    : <GoBookmark className="text-xl" />
                                }
                            </button>
                        </div>
                    </div>

                    {/* Author card */}
                    {authorPostInfo && (
                        <div className="mx-4 sm:mx-8 md:mx-10 mb-6 sm:mb-8 p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 flex items-center gap-4">
                            <img
                                src={authorPostInfo?.avatarUrl || '/user.webp'}
                                alt='avatar'
                                className='h-16 w-16 rounded-full object-cover ring-2 ring-amber-200 shadow'
                            />
                            <div>
                                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-0.5">Tác giả</p>
                                <h3 className="font-bold text-gray-900 text-lg">
                                    {authorPostInfo?.firstName} {authorPostInfo?.lastName}
                                </h3>
                                {authorPostInfo?.bio && (
                                    <p className="text-gray-500 text-sm mt-1">{authorPostInfo.bio}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Comment section */}
                    <div ref={commentSectionRef} id="comment-section" className="border-t border-gray-100 px-4 sm:px-8 md:px-10 py-5 sm:py-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                            <GoComment />
                            Bình luận
                            {dataComments?.length > 0 && (
                                <span className="text-sm font-normal text-gray-400">({dataComments.length})</span>
                            )}
                        </h2>

                        {/* Comment input */}
                        <form onSubmit={handleSubmit(sendComment)} className="mb-6">
                            <div className="flex gap-3 items-start">
                                <img
                                    src={userInfo ? (authorPostInfo?.avatarUrl || '/user.webp') : '/user.webp'}
                                    alt='avatar'
                                    className='h-9 w-9 rounded-full object-cover flex-shrink-0 mt-1 ring-1 ring-gray-200'
                                />
                                <div className="flex-1 border border-gray-200 rounded-2xl overflow-hidden focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                                    <textarea
                                        className="w-full h-20 px-4 pt-3 pb-2 focus:outline-none resize-none text-sm text-gray-700 placeholder-gray-400"
                                        placeholder="Viết bình luận của bạn..."
                                        {...register("content")}
                                    />
                                    <div className="px-3 pb-2 flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Sort buttons */}
                        <div className="flex gap-1 mb-4 border-b border-gray-100 pb-2">
                            <button
                                className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${commentHot ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:bg-gray-100'}`}
                                onClick={() => setCommnetHot(true)}
                            >
                                🔥 Hot nhất
                            </button>
                            <button
                                className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${!commentHot ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:bg-gray-100'}`}
                                onClick={() => setCommnetHot(false)}
                            >
                                🆕 Mới nhất
                            </button>
                        </div>

                        {/* Comments list */}
                        <div className="flex flex-col gap-1">
                            {dataComments?.map((cmt) => (
                                <CommentBox key={cmt.commentId} comment={cmt} />
                            ))}
                            {(!dataComments || dataComments.length === 0) && (
                                <div className="text-center py-10 text-gray-400">
                                    <GoComment className="text-4xl mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default PostDetailPage;