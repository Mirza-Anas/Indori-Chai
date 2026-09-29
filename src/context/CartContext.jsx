"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
const MAX_QUANTITY = 10;

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [coupon, setCoupon] = useState("");

    const applyCoupon = (code) => {
        // Placeholder for coupon logic
        if (code === "DISCOUNT10") {
            setCoupon(code);
        }
    };


    // Load from localStorage
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            setCart(parsedCart.map((item) => ({
                ...item,
                quantity: Math.min(Math.max(Number(item.quantity) || 1, 1), MAX_QUANTITY),
            })));
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Add item
    const addToCart = (product) => {
        const quantityToAdd = Math.min(
            Math.max(Number(product?.quantity) || 1, 1),
            MAX_QUANTITY
        );

        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);

            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: Math.min(
                                (Number(item.quantity) || 1) + quantityToAdd,
                                MAX_QUANTITY
                            ),
                        }
                        : item
                );
            }

            return [...prev, { ...product, quantity: quantityToAdd }];
        });
    };

    // Remove item
    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    // Update quantity
    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) return removeFromCart(productId);

        const nextQuantity = Math.min(Number(quantity) || 1, MAX_QUANTITY);

        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity: nextQuantity } : item
            )
        );
    };

    // Clear cart
    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                coupon,
                setCoupon,
                applyCoupon,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
