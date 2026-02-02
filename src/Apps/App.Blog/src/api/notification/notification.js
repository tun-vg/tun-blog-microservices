import { API } from "../axiosConfig";

export const GetNotificationsByUserId = (userId, pageNumber = 1, pageSize = 10) => {
    const url = `/notification-api/notification?userId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return API.get(url);
}