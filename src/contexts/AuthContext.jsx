import { useState } from "react";
import AuthStateContext from "./AuthStateContext";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem("erp_user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const login = (userData) => {
        const userObject = {
            id: userData.userID,
            email: userData.email,
            role: userData.role
        };

        setUser(userObject);
        localStorage.setItem("erp_user", JSON.stringify(userObject));
        localStorage.setItem("erp_token", userData.token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("erp_user");
        localStorage.removeItem("erp_token");
        window.location.href = "/login";
    };

    return (
        <AuthStateContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthStateContext.Provider>
    );
}
