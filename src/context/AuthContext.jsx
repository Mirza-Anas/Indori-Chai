"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
const AUTH_STORAGE_KEY = "authUser";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to load auth user from localStorage:", error);
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } finally {
            setHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (!hydrated) return;

        try {
            if (user) {
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
            } else {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        } catch (error) {
            console.error("Failed to persist auth user:", error);
        }
    }, [user, hydrated]);

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
