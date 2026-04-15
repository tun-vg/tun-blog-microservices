import { useKeycloak } from "@react-keycloak/web";
import { getUserInfoById } from "../api/user/user";

const useAuthGuard = () => {
    const { keycloak, initialized } = useKeycloak();

    const requireLogin = () => {
        if (!initialized) return false;

        if (!keycloak.authenticated) {
            keycloak.login({
                redirectUri: window.location.href
            });
            return false;
        }

        return true;
    };

    const getUserId = () => {
        return keycloak.tokenParsed?.sub;
    };

    const getUserName = () => {
        return keycloak.tokenParsed?.preferred_username;
    }

    const getUserInfo = () => {
        return keycloak.tokenParsed;
    };

    const getUserExtendInfo = async () => {
        const response = await getUserInfoById(keycloak.tokenParsed?.sub);
        return response;
    }

    return {
        requireLogin,
        getUserId,
        getUserInfo,
        getUserExtendInfo,
        getUserName,
        keycloak,
        initialized
    };
};

export default useAuthGuard;