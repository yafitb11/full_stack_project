import axios from 'axios';

const BACKEND_PORT = import.meta.env.VITE_API_BACKEND_PORT || '8182';

const api = axios.create({
    baseURL: `http://localhost:${BACKEND_PORT}`,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token && config.headers) {
            config.headers["x-auth-token"] = token;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;