import { API } from "../axiosConfig";

export const GetNotificationsByUserId = (userId, pageNumber = 1, pageSize = 10) => {
    const url = `/notification-api/notification?userId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return API.get(url);
}

export const Subscribe = (email) => {
    const url = `/notification-api/Subscription/subscribe?email=${email}`;
    return API.post(url);
}

export const UnSubscribe = (email) => {
    const url = `/notification-api/Subscription/unsubscribe?email=${email}`;
    return API.post(url);    
}