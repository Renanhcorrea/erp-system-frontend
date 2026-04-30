import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const loginUser = async (email, password) => {
    console.log("Calling login API with:", { email });
    console.log("API URL:", `${BASE_URL}/api/auth/login`);

    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password
    });

    console.log("Login response:", response.data);
    return response.data;
};
