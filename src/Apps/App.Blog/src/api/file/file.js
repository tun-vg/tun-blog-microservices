import { API } from "../axiosConfig";

export const uploadFile = (formData) => {
    const url = `file-api/file/upload`;
    return API.post(url, formData);
}