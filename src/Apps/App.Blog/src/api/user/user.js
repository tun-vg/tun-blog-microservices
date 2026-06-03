import { API } from "../axiosConfig";

export const getUserInfoKeyCloakByUserName = (username) => {
    const url = `/user-api/user/get-user?username=${username}`;
    return API.get(url);
}

export const followUserAPI = (data) => {
    const url = `/user-api/user-follow/follow`;
    return API.post(url, data);
}


export const unFollowUserAPI = (data) => {
    const url = `/user-api/user-follow/unfollow`;
    return API.post(url, data);
}

export const getUserInfoById = (userId) => {
    const url = `/user-api/user/${userId}`;
    return API.get(url);
}

export const updateUser = (data) => {
    const url = `/user-api/user/update-user`;
    return API.put(url, data);
}

export const registerUser = (data) => {
    const url = `/user-api/user/register`;
    return API.post(url, data);
}

export const getUserFollowersAPI = (userId) => {
    const url = `/user-api/user-follow/get-followers/${userId}`;
    return API.get(url);
}

export const getUserFollowingsAPI = (userId) => {
    const url = `/user-api/user-follow/get-followings/${userId}`;
    return API.get(url);
}