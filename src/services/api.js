import axios from "axios";

const DEFAULT_BASE_URL = "http://localhost:8080";
const INVALID_ENV_VALUES = new Set(["", "undefined", "null"]);

const normalizeBaseUrl = (value) => {
    const raw = String(value || "").trim();

    if (INVALID_ENV_VALUES.has(raw.toLowerCase())) {
        return null;
    }

    const normalized = raw.replace(/\/+$/, "");

    if (normalized.startsWith("/")) {
        return normalized;
    }

    if (/^https?:\/\//i.test(normalized)) {
        return normalized;
    }

    return null;
};

const BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL) || DEFAULT_BASE_URL;

const api = axios.create({
    baseURL: `${BASE_URL.replace(/\/+$/, "")}/api`
});

const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string") {
        return data;
    }

    return data?.message || data?.error || null;
};

export const getFriendlyApiError = (error, fallback = "Unexpected error. Please try again.") => {
    const status = error?.response?.status;
    const backendMessage = getErrorMessage(error);

    if (status === 400) {
        return backendMessage || "Invalid request data. Please review the form and try again.";
    }

    if (status === 401) {
        return "Your session expired. Please sign in again.";
    }

    if (status === 403) {
        return "You do not have permission to perform this action.";
    }

    return backendMessage || error?.message || fallback;
};

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
