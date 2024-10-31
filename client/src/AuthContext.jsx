import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import authService from './authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { t } = useTranslation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            const authStatus = await authService.isAuthenticated();
            setIsAuthenticated(authStatus);
            if (authStatus) {
                const profile = await authService.getProfile();
                setUser(profile);
            } else {
                setUser(null);
                authService.logout();
            }
        };
        checkAuthStatus();
    }, []);

    const login = async (username, password) => {
        try {
            const user = await authService.login(username, password);
            if (!user) return;
            setUser(user);
            setIsAuthenticated(true);
            toast.success(t('login.success'));
        } catch (error) {
            toast.error(error.message);
            console.error('Login error:', error);
        }
    };

    const register = async (username, email, password) => {
        try {
            const user = await authService.register(username, email, password);
            if (!user) return;
            setUser(user);
            setIsAuthenticated(true);
            toast.success(t('register.success'));
        } catch (error) {
            toast.error(error.message);
            console.error('Register error:', error);
        }
    }

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
