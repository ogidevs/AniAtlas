import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import authService from "./authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const authStatus = await authService.isAuthenticated();
      if (authStatus) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
          setIsAuthenticated(authStatus);
        } catch (error) {
          toast.error(error.message);
          logout();
        }
      } else {
        logout();
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
      toast.success(t("login.success"));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const register = async (username, email, password) => {
    try {
      const user = await authService.register(username, email, password);
      if (!user) return;
      setUser(user);
      setIsAuthenticated(true);
      toast.success(t("register.success"));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const fetchWithAuth = async (url, options = {}) => {
    try {
      const response = await authService.fetchWithAuth(url, options);
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.clone().json();
      if (data.code && data.code !== 200) {
        throw new Error(data.detail);
      }
      return response;
    } catch (error) {
      if (parseInt(error.message) === 401) {
        toast.error(t("error.unauthorized"));
        window.location.href = "/login";
        logout();
      } else if (parseInt(error.message) === 403) {
        toast.error(t("error.forbidden"));
        window.location.href = "/login";
        logout();
      } else if (parseInt(error.message) === 404) {
        toast.error(t("error.notFound"));
      } else if (parseInt(error.message) === 429) {
        toast.error(t("error.tooManyRequests"));
      } else if (parseInt(error.message) === 500) {
        toast.error(t("error.serverError"));
      } else {
        toast.error(error.message);
      }
      console.error("Error fetching data:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, fetchWithAuth, login, logout, register, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
