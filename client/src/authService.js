// src/authService.js
import axios from "axios";
import { API_URL } from "./config";

const authService = {

  getToken: () => localStorage.getItem("token"),

  setToken: (token) => localStorage.setItem("token", token),

  removeToken: () => localStorage.removeItem("token"),

  isAuthenticated: async () => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const response = await axios.get(`${API_URL}/user/verify`, {
      headers: authService.getAuthHeaders(),
      });

      if (response.status !== 200) {
      authService.removeToken();
      console.error("Verification failed:", response.data.detail?.msg || "Unknown error");
      return false;
      }

      return true;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    }
  },

  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/user/signin`, {
      username,
      password,
      });

      const data = response.data;
      if (!response.status === 200 || !data.data?.token) {
      throw new Error(data.detail?.msg || data.message || "Login failed");
      }

      authService.setToken(data.data.token);
      return data.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
    },

  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/user/me`, {
      headers: authService.getAuthHeaders(),
      });

      const data = response.data;
      if (!response.status === 200 || !data.data) {
      throw new Error(
        data.detail?.[0]?.msg || data.message || "Profile fetch failed"
      );
      }

      return data.data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/user/signup`, {
        username,
        email,
        password,
      });

      const data = response.data;
      if (!response.status === 200 || !data.data?.token) {
        throw new Error(
          data.detail?.[0]?.msg || data.message || "Registration failed"
        );
      }

      authService.setToken(data.data.token);
      return data.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  logout: () => {
    authService.removeToken();
  },

  getAuthHeaders: () => {
    const token = authService.getToken();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  },
};

export default authService;
