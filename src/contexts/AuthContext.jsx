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

    const login = (userData, email, password) => {
        const credentials = btoa(`${email}:${password}`);

        const fullUser = { 
            ...userData,
            email: userData.email || email
        };

        setUser(fullUser);

        localStorage.setItem("erp_user", JSON.stringify(fullUser));
        localStorage.setItem("erp_credentials", credentials);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("erp_user");
        localStorage.removeItem("erp_credentials");
        window.location.href = "/login";
    };

    return (
        <AuthStateContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthStateContext.Provider>
    );
}
