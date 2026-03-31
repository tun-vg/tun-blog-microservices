import { useKeycloak } from "@react-keycloak/web";

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

    const getUserInfo = () => {
        return keycloak.tokenParsed;
    };

    return {
        requireLogin,
        getUserId,
        getUserInfo,
        keycloak,
        initialized
    };
};

export default useAuthGuard;