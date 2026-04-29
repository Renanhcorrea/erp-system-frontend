import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: `${BASE_URL}/api`
});

api.interceptors.request.use((config) => {
    const credentials = localStorage.getItem("erp_credentials");
    if (credentials) {
        config.headers.Authorization = `Basic ${credentials}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("erp_user");
            localStorage.removeItem("erp_credentials");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
