import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

export const Auth = createContext();

export default function AuthProvider({ children }) {
    const [isLogin, setLogin] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const authToken = getAuthToken();

    useEffect(() => {
        if (userDetails?.userimg && !userDetails.userimg.startsWith('/api/profiles/')) {
            setUserDetails((prev) => ({
                ...prev,
                userimg: '/api/profiles/' + userDetails.userimg.split('/').pop(),
            }));
        }
    }, [userDetails]);
    

    useEffect(() => {
        const initializeAuth = async () => {
            if (authToken) {
                const auth = await authenticate(authToken);
                if (auth?.data?.success) {
                    setUserDetails(auth.data.details[0]);
                    setLogin(true);
                } else {
                    logout();
                }
            }
        };

        initializeAuth();
    }, [authToken]);

    return (
        <Auth.Provider value={{ isLogin, setLogin, userDetails, setUserDetails }}>
            {children}
        </Auth.Provider>
    );
}

// Authentication Functions
export async function reqAuth(data) {
    try {
        const resp = await request('user', 'post', data);
        if (resp.status === 200) {
            const isSuccess = resp.data.success || false;

            if (isSuccess && resp.data.authToken) {
                setAuthToken(resp.data.authToken);
            }
            return isSuccess;
        }
    } catch (error) {
        return error.message;
    }
}

export function logout() {
    removeAuthToken();
    window.location.reload();
}

// Helper Functions
export async function request(route, method, payload, headers = {}) {
    try {
        const resp = await axios({
            url: `/api/${route}.php`,
            method,
            data: payload,
            headers,
        });
        return resp;
    } catch (error) {
        console.error('Request error:', error);
        return { error: error.message };
    }
}

export function useAuth() {
    return useContext(Auth);
}

export function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

export function getAuthToken() {
    return localStorage.getItem('authToken');
}

export function removeAuthToken() {
    localStorage.removeItem('authToken');
}

export async function authenticate(authToken) {
    if (authToken) {
        try {
            const resp = await request('user', 'post', { authToken, route: 'authenticate' });
            return resp;
        } catch (error) {
            console.error('Authentication error:', error);
            return { error: error.message };
        }
    }
    return false;
}
