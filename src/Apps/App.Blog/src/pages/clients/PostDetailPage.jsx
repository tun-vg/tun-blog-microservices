import { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostsById } from "../../api/post/post";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useForm } from "react-hook-form";
import { CiHeart } from "react-icons/ci";
import CommentBox from "../../components/widgets/CommentBox";
import { useKeycloak } from "@react-keycloak/web";
import { addComment, getCommentByPostId } from "../../api/comment/comment";
import { converterTimeToOnlyDate } from "../../utils/handleTimeShow";
import { toast, ToastContainer } from "react-toastify";

const PostDetailPage = () => {
    const { postId, slug } = useParams();
    const { handleSubmit, control, register, reset } = useForm({
        defaultValues: { postId: null, authorId: null, content: null, upperCommentId: null }
    });
    
    const { keycloak } = useKeycloak();
    const [userInfo, setUserInfo] = useState(null);
    const [dataPost, setDataPost] = useState(null);

    // 1 hot - 2 new
    const [commentHot, setCommnetHot] = useState(true);
    const [dataComments, setDataComments] = useState([]);

    const getDataPost = async () => {
        const result = await getPostsById(postId);
        setDataPost(result.value);
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
        if (keycloak) {
            setUserInfo(keycloak?.tokenParsed);
        }
    }, [keycloak]);

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
        var arr = [...dataComment, ...response];
        setDataComments(arr);
    }

    useEffect(() => {
        getDataComments(postId);
    }, [commentHot])

    const dataComment = [
        // {
        //     commentId: 1,
        //     authorName: 'Vuong Toan Thang',
        //     createdAt: '01/01/2025',
        //     content: 'Bài viết rất bổ ích với nhiều nội dung hấp dẫn',
        //     likedCount: 5,
        //     commentReplies: [
        //         {
        //             commentId: 4,
        //             authorName: 'Vuong Toan Thang',
        //             createdAt: '01/01/2025',
        //             content: 'Bài viết rất bổ ích với nhiều nội dung hấp dẫn',
        //             likedCount: 0,
        //             commentReplies: [
        //                 {
        //                     commentId: 18,
        //                     authorName: 'Vuong Toan Truong',
        //                     createdAt: '01/01/2025',
        //                     content: 'Bài viết rất bổ ích với nhiều nội dung hấp dẫn',
        //                     likedCount: 7,
        //                     replies: []
        //                 },
        //             ]
        //         },
        //         {
        //             commentId: 6,
        //             authorName: 'Vuong Toan Thang',
        //             createdAt: '01/01/2025',
        //             content: 'Bài viết rất bổ ích với nhiều nội dung hấp dẫn',
        //             likedCount: 1,
        //             commentReplies: []
        //         },
        //     ]
        // },
        // {
        //     commentId: 5,
        //     authorName: 'Vuong Toan Tien',
        //     createdAt: '02/01/2025',
        //     content: 'Bài viết rất bổ ích với nhiều nội dung hấp dẫn',
        //     likedCount: 25,
        //     commentReplies: [
        //         {
        //             commentId: 7,
        //             authorName: 'Vuong Toan Thang',
        //             createdAt: '01/01/2025',
        //             content: 'Bài viết rất bổ ích với nhiều nội dung hấp dẫn',
        //             likedCount: 10,
        //             commentReplies: []
        //         },
        //         {
        //             commentId: 8,
        //             authorName: 'Vuong Toan Truong',
        //             createdAt: '01/01/2025',
        //             content: 'Bài viết rất bổ ích với nhiều nội dung hấp dẫn',
        //             likedCount: 7,
        //             commentReplies: []
        //         },
        //     ]
        // }
    ]

    const doReplyComment = async (commentParent, commentReply) => {
        // console.log("Data comment parent", commentParent);
        // console.log("Data comment reply", commentReply);
        // commentReply.upperCommentId = commentParent.commentId;
        // commentReply.postId = postId;
        // commentReply.authorId = userInfo?.sub;
        // let response = await addComment(commentReply);
        // let arr = [...commentParent.commentReplies, response];
        // commentParent.commentReplies = arr;
    }

    return (
        <>
            <div className="container-app">
                <div className="text-gray-500 flex justify-between">
                    <div>Thể thao</div>
                    <div className="flex gap-x-2">
                        {/* {dataPost?.PostTags?.map(pt => {
                            return <div>
                                {pt.TagName}
                            </div>
                        })} */}
                        <div>Bóng đá</div>
                        <div>Bóng chuyền</div>
                    </div>
                </div>

                <div className="font-semibold text-xl">
                    {dataPost?.title}
                </div>
                <div className='flex gap-x-2 items-center'>
                    <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='avatar' className='h-11 w-11 rounded-full' />
                    <div>
                        <h3 className='font-semibold'>
                            Vương Toàn Tuấn
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
                <div>
                    {dataPost?.content}
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

                        {dataComments && dataComments.length > 0 && (
                            <div>
                                {dataComments.map((cmt) => (
                                    <div
                                        key={cmt.commentId} 
                                        className="mb-6"
                                    >
                                        <CommentBox key={cmt.commentId} comment={cmt} replyComment={doReplyComment}/>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default PostDetailPage;