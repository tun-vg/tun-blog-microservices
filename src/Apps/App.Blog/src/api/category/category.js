import { API } from "../axiosConfig";

export const getCategories = async () => {
    const url = `/post-api/category`;
    return await API.get(url);
}