import { API } from "../axiosConfig";

export const getTags = () => {
    const url = '/post-api/tag?page=1&pageSize=20';
    return API.get(url);
}

export const getTagBytagId = (tagtagId) => {
    const url = `/post-api/tag/${tagtagId}`;
    return API.get(url);
}

export const addTag = (tag) => {
    const url = `/post-api/tag`;
    return API.post(url, tag);
}

export const updateTag = (tag) => {
    const url = `/post-api/tag`;
    return API.put(url, tag);
}

export const deleteTag = (tagtagId) => {
    const url = `/post-api/tag/${tagtagId}`;
    return API.delete(url);
}

export const getTagsByCategoryId = (categoryId) => {
    const url = `/post-api/tag/get-tags-by-category/${categoryId}`;
    return API.get(url);
}