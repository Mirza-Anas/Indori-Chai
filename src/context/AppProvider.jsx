"use client";

import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <CartProvider>{children}</CartProvider>
        </AuthProvider>
    );
};