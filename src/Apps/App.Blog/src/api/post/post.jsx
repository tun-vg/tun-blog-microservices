import apiConfig, { API } from "../axiosConfig";

export const getPostsTrending = () => {
    const url = `/post-api/post/get-posts-trending?month=8&year=2025&size=4`;
    return API.get(url);
}

export const getFeaturedPosts = () => {
    const url = `/post-api/post/get-posts?page=1&pageSize=4`;
    return API.get(url);
}

export const getRecommendedPosts = () => {
    const url = `/post-api/post/get-posts?page=1&pageSize=10`;
    return API.get(url);
}

export const getPostsById = (postId) => {
    const url = `/post-api/post/get-post/${postId}`;
    return API.get(url);
}

export const addPost = (post) => {
    const url = `/post-api/post/create-post`;
    return API.postForm(url, post);
}

export const updatePost = (post) => {
    const url = `/post-api/post/update-post`;
    return API.put(url, post);
}

export const getPosts = (paging) => {
    const url = `/post-api/post/get-posts?page=${paging.page}&pageSize=${paging.pageSize}&search=${paging.search}&sortBy=${paging.sortBy}&isDescending=${paging.isDescending}`;
    return API.get(url);
}

export const getPostsByUserId = (page, pageSize, userId) => {
    const url = `/post-api/post/get-posts-by-userId?page=${page}&pageSize=${pageSize}&userId=${userId}`;
    return API.get(url);
}

export const searchPost = (search, type, page, pageSize) => {
    const url = `/post-api/post/search?search=${search}&type=${type}&page=${page}&pageSize=${pageSize}`;
    return API.get(url);
}

export const viewPost = (postId) => {
    const url = `/post-api/post/view-post/${postId}`;
    return API.post(url);
}

export const upVote = (data) => {
    const url = `/post-api/post/up-vote`;
    return API.post(url, data)
}

export const downVote = (data) => {
    const url = `/post-api/post/down-vote`;
    return API.post(url, data);
}

export const addBookMark = (data) => {
    const url = `/post-api/post/add-book-mark`;
    return API.post(url, data);
}

export const removeBookMark = (data) => {
    const url = `/post-api/post/remove-book-mark`;
    return API.post(url, data);
}

export const checkUserBookMarkPost = (data) => {
    const url = `/post-api/post/check-user-book-mark-post`;
    return API.get(url, data);
}

export const getBookMarkPostByUserId = (page, pageSize, userId) => {
    const url = `/post-api/post/get-book-mark-posts?page=${page}&pageSize=${pageSize}&userId=${userId}`;
    return API.get(url);
}