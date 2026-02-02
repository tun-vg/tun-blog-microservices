import { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { converterTimeToDateTime, converteTimeToString } from "../../utils/handleTimeShow";
import { useForm } from "react-hook-form";
import { addComment, getCommentRepliesByCommentParentId, likeComment, unLikeComment } from "../../api/comment/comment";
import { useKeycloak } from "@react-keycloak/web";

// import icon
import { CiHeart } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";

const CommentBox = ({ comment, replyComment }) => {
    const [isReplyComment, setIsReplyComment] = useState(false);
    const [commentReplies, setCommentReplies] = useState(comment.commentReplies || []);
    const [isOpenCommentReply, setIsOpenCommentReply] = useState(false);
    const { handleSubmit, register, reset } = useForm();
    const { keycloak } = useKeycloak();
    const [userInfo, setUserInfo] = useState(null);
    const [commentLikedCount, setCommentLikedCount] = useState(comment.likedCount || 0);
    const [commentReactions, setCommentReactions] = useState(comment.commentReactions || []);

    useEffect(() => {
        if (keycloak) {
            setUserInfo(keycloak?.tokenParsed);
        }
    }, [keycloak]);

    const handleReplyCmt = async (commentRep) => {
        // replyComment(comment, commentRep);
        console.log("Data comment parent", comment);
        console.log("Data comment reply", commentRep);
        commentRep.upperCommentId = comment.commentId;
        commentRep.postId = comment.postId;
        commentRep.authorId = userInfo?.sub;
        let response = await addComment(commentRep);
        setCommentReplies(prev => [...prev, response]);
        comment.commentReplyCount += 1;
        reset();
        toast.success("Thêm bình luận thành công!");
    }


    const showReplyComment = async () => {
        setIsOpenCommentReply(true);
        setCommentReplies([]);
        const response = await getCommentRepliesByCommentParentId(comment?.commentId);
        setCommentReplies(prev => [...prev, ...response]);
    }

    useEffect(() => {
        setCommentReplies(comment.commentReplies || []);
    }, [comment.commentReplies]);

    const handleLikeComment = async () => {
        const data = { commentId: comment.commentId, userId: userInfo?.sub };
        const response = await likeComment(data);
        if (response) {
            setCommentLikedCount(commentLikedCount + 1);
            setCommentReactions(prev => [...prev, data])
        }
    }

    const handleUnLikeComment = async () => {
        console.log(commentReactions);
        
        const data = { commentId: comment.commentId, userId: userInfo?.sub };
        console.log(data);
        
        const response = await unLikeComment(data);
        if (response) {
            setCommentLikedCount(commentLikedCount - 1);
        }
        
        const newReactionList = commentReactions.filter(obj => obj.commentId !== data.commentId && obj.userId !== data.userId);
        setCommentReactions(newReactionList);
        console.log(commentReactions);
    }

    const checkUserLikedPost = (commentReactionList, userId) => {
        for (let e = 0; e < commentReactionList.length; e++) {
            const rt = commentReactionList[e];
            if (rt.userId === userId) {
                return true;
            }
        }
        return false;
    }

    const removeReaction = () => {
        
    }

    return (
        <div className="relative my-3 ml-1">
            {comment.isOpenReply && (
                <div className="absolute left-[-32px] top-6 w-7 h-px bg-gray-300"></div>
            )}
            {comment.isTransientOpenReply && (
                <div className="absolute left-[-29px] top-6 w-7 h-px bg-gray-300"></div>
            )}

            <div className='flex gap-x-2 items-center'>
                <img src='https://lh7-rt.googleusercontent.com/docsz/AD_4nXcvDH5qqP55rOehebEQChMCroH0U6PAvG55-o-eRHARHz1CifVLkoziLUDwE326CSAB4ch6sGHOu2W8BaiInFCfijcCTVCkt6M-LdQ0FnlOAU755T05ZqoIQLAkCPH2E8Glhg3Qnw?key=E_klvQY5pnbczCrBuwbNLg' alt='avatar' className='h-11 w-11 rounded-full' />
                <div className="bg-gray-200 py-1 px-3 rounded-lg">
                    <h3 className='font-semibold'>
                        {comment.authorName}
                    </h3>
                    <p>{comment.content}</p>
                </div>
            </div>

            <div>
                <div>
                    <div className="flex justify-start items-center gap-x-3 ml-14">
                        <div>
                            <h3 data-tooltip-id={`my-tooltip-date-${comment.commentId}`} className="text-gray-500 w-fit">{converteTimeToString(comment.createdAt)}</h3>
                            <ReactTooltip
                                id={`my-tooltip-date-${comment.commentId}`}
                                place='bottom'
                                content={converterTimeToDateTime(comment.createdAt)}
                                className="z-10"
                            />
                        </div>
                        <div className="grid grid-cols-2 items-center">

                            {userInfo && checkUserLikedPost(commentReactions, userInfo.sub)
                                ?
                                <button
                                    onClick={() => handleUnLikeComment()}
                                >
                                    <FcLike className="text-2xl pt-[2px]" />
                                </button>
                                :
                                <button
                                    onClick={() => handleLikeComment()}
                                >
                                    <CiHeart className="text-2xl pt-[2px]" />
                                </button>}

                            <span>{commentLikedCount}</span>
                        </div>
                        <button
                            className="hover:text-blue-400"
                            onClick={() => setIsReplyComment(true)}
                        >
                            Trả lời
                        </button>
                    </div>
                    {comment.commentReplyCount > 0 && !isOpenCommentReply && <div className="relative ml-14 flex items-center gap-1 text-gray-500">
                        <div className="absolute left-[-33px] top-[-24px] bottom-[9px] w-px bg-gray-300"></div>
                        <div className="absolute left-[-33px] top-4 w-7 h-px bg-gray-300"></div>
                        <button
                            onClick={() => showReplyComment()}
                            className="font-semibold text-sm pt-[6px]"
                        >
                            {comment.commentReplyCount === 1 && <span>
                                Xem {comment.commentReplyCount} phản hồi
                            </span>
                            }
                            {comment.commentReplyCount > 1 && <span>
                                Xem tất cả {comment.commentReplyCount} phản hồi
                            </span>
                            }
                        </button>
                        <FaAngleDown className="mt-[2px]" />
                    </div>
                    }
                </div>
                {commentReplies.length > 0 && !isOpenCommentReply && (
                    <div className="relative ml-12 mt-2">
                        <div className="absolute left-[-25px] top-[-35px] bottom-0 w-px bg-gray-300"></div>

                        {commentReplies.map((reply) => (
                            <div key={reply.id}>
                                <CommentBox comment={{ ...reply, isTransientOpenReply: true }} replyComment={replyComment} />
                            </div>
                        ))}
                    </div>
                )}
                {commentReplies.length > 0 && isOpenCommentReply && (
                    <div className="relative ml-12 mt-2">
                        <div className="absolute left-[-28px] top-[-35px] bottom-0 w-px bg-gray-300"></div>

                        {commentReplies.map((reply) => (
                            <div key={reply.id}>
                                <CommentBox comment={{ ...reply, isOpenReply: true }} replyComment={replyComment} />
                            </div>
                        ))}
                    </div>
                )}
                {isReplyComment && <div>
                    <form onSubmit={handleSubmit(handleReplyCmt)}>
                        <div className="flex">
                            <input
                                type="hidden"
                                {...register("upperCommentId")}
                            />
                            <textarea
                                className="w-full h-12 p-2 focus:outline-none resize-none"
                                placeholder="Trả lời"
                                {...register("content")}
                            />
                            <button
                                className="p-2 text-nowrap font-medium"
                            >
                                Trả lời
                            </button>
                        </div>
                        <hr />
                    </form>
                </div>
                }
            </div>
            <ToastContainer />
        </div>
    )
}

export default CommentBox;