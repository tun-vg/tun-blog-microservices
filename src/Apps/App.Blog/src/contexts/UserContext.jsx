import { createContext, useContext, useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { getUserInfoById } from '../api/user/user';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const { keycloak, initialized } = useKeycloak();
    const [userInfo, setUserInfo] = useState(null);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await getUserInfoById(userId);
            setUserInfo(response);
        } catch (error) {
            console.log("Fetch user info error", error);
        }
    };

    const updateUserInfo = (newUserInfo) => {
        setUserInfo(newUserInfo);
    };

    useEffect(() => {
        if (initialized && keycloak.authenticated) {
            fetchUserInfo(keycloak?.tokenParsed?.sub);
        }
        if (initialized && !keycloak.authenticated) {
            setUserInfo(null);
        }
    }, [initialized, keycloak]);

    return (
        <UserContext.Provider value={{ userInfo, updateUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};