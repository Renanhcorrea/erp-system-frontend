import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
    baseURL: `${BASE_URL}/api`
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("erp_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, 
    (error) => {
    return Promise.reject(error); 
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API ERROR:", {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            localStorage.removeItem("erp_user");
            localStorage.removeItem("erp_token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default api;
