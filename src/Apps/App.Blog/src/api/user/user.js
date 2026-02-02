import { API } from "../axiosConfig";
import keycloak from "../../keycloak";

export const getUserInfoKeyCloakByUserName = (username) => {
    // const url = `${keycloak?.authServerUrl}/admin/realms/${keycloak?.realm}/users?username=${username}`;
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