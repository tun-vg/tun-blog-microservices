import { API } from "../axiosConfig";

export const getCommentByPostId = (postId, isHot) => {
    const url = `/comment-api/post/${postId}/comments?hot=${isHot}`;
    return API.get(url);
}

export const addComment = (comment) => {
    const url = `/comment-api/comment`;
    return API.post(url, comment);
}

export const editComment = (comment) => {
    const url = `/comment-api/comment`;
    return API.put(url, comment);
}

export const deleteComment = (commentId) => {
    const url = `/comment-api/comment/${commentId}`;
    return API.delete(url);
}

export const likeComment = (comment) => {
    const url = `/comment-api/like-comment`;
    return API.post(url, comment);
}

export const unLikeComment = (comment) => {
    const url = `/comment-api/unlike-comment`;
    return API.post(url, comment);
}

export const getCommentRepliesByCommentParentId = (commentId) => {
    const url = `/comment-api/comment-replies/${commentId}`;
    return API.get(url);
}