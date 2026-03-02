import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for persisted user
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    async function signup(email, password, name, role) {
        const user = await registerUser(email, password, name, role); // Added name & role
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.role);
        return user;
    }

    async function login(email, password) {
        const user = await loginUser(email, password);
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userRole", user.role);
        return user;
    }

    function logout() {
        setCurrentUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
    }

    const value = {
        currentUser,
        signup,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
