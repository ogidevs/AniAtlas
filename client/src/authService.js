// src/authService.js

const authService = {
    getToken: () => localStorage.getItem('token'),

    setToken: (token) => localStorage.setItem('token', token),

    removeToken: () => localStorage.removeItem('token'),

    isAuthenticated: async () => {
        const token = authService.getToken();
        if (!token) return false;

        try {
            const response = await fetch(`/user/verify`, {
                method: 'GET',
                headers: authService.getAuthHeaders(),
                cache: 'no-store',
            });

            if (!response.ok) {
                authService.removeToken();
                const { detail } = await response.json();
                console.error('Verification failed:', detail.msg || 'Unknown error');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Authentication error:', error);
            return false;
        }
    },

    login: async (username, password) => {
        try {
            const response = await fetch(`/user/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                cache: 'no-store',
            });

            const data = await response.json();
            if (!response.ok || !data.data?.token) {
                throw new Error(data.detail?.msg || data.message || 'Login failed');
            }

            authService.setToken(data.data.token);
            return data.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    getProfile: async () => {
        try {
            const response = await fetch(`/user/me`, {
                method: 'GET',
                headers: authService.getAuthHeaders(),
                cache: 'no-store',
            });

            const data = await response.json();
            if (!response.ok || !data.data) {
                throw new Error(data.detail?.[0]?.msg || data.message || 'Profile fetch failed');
            }

            return data.data;
        } catch (error) {
            console.error('Profile fetch error:', error);
            throw error;
        }
    },

    register: async (username, email, password) => {
        try {
            const response = await fetch(`/user/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
                cache: 'no-store',
            });

            const data = await response.json();
            if (!response.ok || !data.data?.token) {
                throw new Error(data.detail?.[0]?.msg || data.message || 'Registration failed');
            }

            authService.setToken(data.data.token);
            return data.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    logout: () => {
        authService.removeToken();
    },

    getAuthHeaders: () => {
        const token = authService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    },
};

export default authService;
