"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
const AUTH_STORAGE_KEY = "authUser";

export const AuthProvider = ({ children }) => {
    const router = useRouter();
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

    const logout = () => {
        setUser(null);
        router.push("/auth");
    };

    const updateUser = (patch = {}) => {
        setUser((prev) => {
            if (!prev) return prev;
            const nextCustomer = {
                ...(prev.customer || {}),
                ...(patch.customer || {}),
            };

            return {
                ...prev,
                ...patch,
                customer: nextCustomer,
            };
        });
    };

    return (
        <AuthContext.Provider value={{ user, setUser, updateUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
