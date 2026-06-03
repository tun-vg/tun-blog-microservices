import { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { converterTimeToDateTime, converteTimeToString } from "../../utils/handleTimeShow";
import { useForm } from "react-hook-form";
import { addComment, getCommentRepliesByCommentParentId, likeComment, unLikeComment } from "../../api/comment/comment";
import { useKeycloak } from "@react-keycloak/web";

import { CiHeart } from "react-icons/ci";
import { FaAngleDown } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import { toast, ToastContainer } from "react-toastify";

// ── Inline reply item (not recursive, keeps tree structure clean) ──────────────
const ReplyItem = ({ reply, userInfo, onReplyClick }) => {
    const [likedCount, setLikedCount] = useState(reply.likedCount || 0);
    const [reactions, setReactions] = useState(reply.commentReactions || []);
    const isLiked = userInfo && reactions.some(r => r.userId === userInfo.sub);

    const handleLike = async () => {
        const data = { commentId: reply.commentId, userId: userInfo?.sub };
        const res = await likeComment(data);
        if (res) { setLikedCount(c => c + 1); setReactions(p => [...p, data]); }
    };

    const handleUnlike = async () => {
        const data = { commentId: reply.commentId, userId: userInfo?.sub };
        const res = await unLikeComment(data);
        if (res) {
            setLikedCount(c => c - 1);
            setReactions(p => p.filter(r => !(r.commentId === data.commentId && r.userId === data.userId)));
        }
    };

    return (
        <div className="flex gap-3 mt-3">
            <img
                src="/user.webp"
                alt="avatar"
                className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
                    <h3 className="font-semibold text-sm text-gray-900 mb-0.5">{reply.authorName}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{reply.content}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 ml-2">
                    <span
                        data-tooltip-id={`reply-date-${reply.commentId}`}
                        className="text-xs text-gray-400"
                    >
                        {converteTimeToString(reply.createdAt)}
                    </span>
                    <ReactTooltip
                        id={`reply-date-${reply.commentId}`}
                        place="bottom"
                        content={converterTimeToDateTime(reply.createdAt)}
                        className="z-10"
                    />
                    <button
                        onClick={isLiked ? handleUnlike : handleLike}
                        className={`flex items-center gap-1 text-xs font-medium transition-colors ${isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'}`}
                    >
                        {isLiked ? <FcLike className="text-sm" /> : <CiHeart className="text-sm" />}
                        {likedCount > 0 && <span>{likedCount}</span>}
                    </button>
                    <button
                        className="text-xs font-medium text-gray-400 hover:text-amber-600 transition-colors"
                        onClick={() => onReplyClick && onReplyClick()}
                    >
                        Trả lời
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Main CommentBox ────────────────────────────────────────────────────────────
const CommentBox = ({ comment }) => {
    const [isReplyComment, setIsReplyComment] = useState(false);
    const [commentReplies, setCommentReplies] = useState(comment.commentReplies || []);
    const [isOpenCommentReply, setIsOpenCommentReply] = useState(false);
    const { handleSubmit, register, reset } = useForm();
    const { keycloak, initialized } = useKeycloak();
    const [userInfo, setUserInfo] = useState(null);
    const [commentLikedCount, setCommentLikedCount] = useState(comment.likedCount || 0);
    const [commentReactions, setCommentReactions] = useState(comment.commentReactions || []);

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            setUserInfo(keycloak?.tokenParsed);
        }
    }, [initialized, keycloak]);

    const handleReplyCmt = async (data) => {
        data.upperCommentId = comment.commentId;
        data.postId = comment.postId;
        data.authorId = userInfo?.sub;
        const response = await addComment(data);
        setCommentReplies(prev => [...prev, response]);
        comment.commentReplyCount = (comment.commentReplyCount || 0) + 1;
        reset();
        setIsReplyComment(false);
        toast.success("Thêm bình luận thành công!");
    };

    const showReplyComment = async () => {
        setIsOpenCommentReply(true);
        setCommentReplies([]);
        const response = await getCommentRepliesByCommentParentId(comment?.commentId);
        setCommentReplies(prev => [...prev, ...response]);
    };

    useEffect(() => {
        setCommentReplies(comment.commentReplies || []);
    }, [comment.commentReplies]);

    const handleLikeComment = async () => {
        const data = { commentId: comment.commentId, userId: userInfo?.sub };
        const response = await likeComment(data);
        if (response) {
            setCommentLikedCount(c => c + 1);
            setCommentReactions(prev => [...prev, data]);
        }
    };

    const handleUnLikeComment = async () => {
        const data = { commentId: comment.commentId, userId: userInfo?.sub };
        const response = await unLikeComment(data);
        if (response) setCommentLikedCount(c => c - 1);
        setCommentReactions(prev =>
            prev.filter(r => !(r.commentId === data.commentId && r.userId === data.userId))
        );
    };

    const isLiked = userInfo && commentReactions.some(r => r.userId === userInfo.sub);
    // Show thread line only when replies are expanded or reply form is open
    const showThread = commentReplies.length > 0 || isReplyComment;

    return (
        <div className="py-2">
            {/*
             * Layout:
             *   [avatar col 36px] [content col flex-1]
             *   The avatar col grows to match content height via flex stretch.
             *   The flex-1 "thread line" inside avatar col fills space below avatar.
             *   Replies are inside content col, so thread line naturally spans them.
             */}
            <div className="flex gap-3" style={{ alignItems: 'stretch' }}>

                {/* ── Avatar column (left) ── */}
                <div className="flex flex-col items-center flex-shrink-0" style={{ width: 36 }}>
                    <img
                        src="/user.webp"
                        alt="avatar"
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
                    />
                    {/* Thread line: extends downward through all replies */}
                    {showThread && (
                        <div
                            className="bg-gray-300 rounded-full mt-2 flex-1"
                            style={{ width: 2, minHeight: 24 }}
                        />
                    )}
                </div>

                {/* ── Content column (right) ── */}
                <div className="flex-1 min-w-0">
                    {/* Parent bubble */}
                    <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                        <h3 className="font-semibold text-sm text-gray-900 mb-0.5">{comment.authorName}</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-1.5 ml-2">
                        <span
                            data-tooltip-id={`cmt-date-${comment.commentId}`}
                            className="text-xs text-gray-400 cursor-default"
                        >
                            {converteTimeToString(comment.createdAt)}
                        </span>
                        <ReactTooltip
                            id={`cmt-date-${comment.commentId}`}
                            place="bottom"
                            content={converterTimeToDateTime(comment.createdAt)}
                            className="z-10"
                        />
                        <button
                            onClick={isLiked ? handleUnLikeComment : handleLikeComment}
                            className={`flex items-center gap-1 text-xs font-medium transition-colors ${isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'}`}
                        >
                            {isLiked ? <FcLike className="text-sm" /> : <CiHeart className="text-sm" />}
                            {commentLikedCount > 0 && <span>{commentLikedCount}</span>}
                        </button>
                        <button
                            className="text-xs font-medium text-gray-400 hover:text-amber-600 transition-colors"
                            onClick={() => setIsReplyComment(v => !v)}
                        >
                            Trả lời
                        </button>
                    </div>

                    {/* "Xem phản hồi" button */}
                    {comment.commentReplyCount > 0 && !isOpenCommentReply && (
                        <button
                            onClick={showReplyComment}
                            className="flex items-center gap-1.5 mt-2 ml-2 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                        >
                            <FaAngleDown />
                            Xem {comment.commentReplyCount > 1
                                ? `tất cả ${comment.commentReplyCount} phản hồi`
                                : `${comment.commentReplyCount} phản hồi`}
                        </button>
                    )}

                    {/* Replies — rendered inline, connected by thread line above */}
                    {commentReplies.map((reply) => (
                        <ReplyItem
                            key={reply.commentId || reply.id}
                            reply={reply}
                            userInfo={userInfo}
                            onReplyClick={() => setIsReplyComment(true)}
                        />
                    ))}

                    {/* Reply form */}
                    {isReplyComment && (
                        <div className="flex gap-3 mt-3">
                            <img
                                src="/user.webp"
                                alt="avatar"
                                className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200 flex-shrink-0"
                            />
                            <form onSubmit={handleSubmit(handleReplyCmt)} className="flex-1">
                                <input type="hidden" {...register("upperCommentId")} />
                                <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-100 transition-all">
                                    <textarea
                                        className="w-full h-14 px-3 pt-2 text-sm focus:outline-none resize-none placeholder-gray-400"
                                        placeholder="Viết phản hồi..."
                                        {...register("content")}
                                    />
                                    <div className="px-3 pb-2 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsReplyComment(false)}
                                            className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1 rounded-full transition-colors"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full transition-colors"
                                        >
                                            Gửi
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CommentBox;
