import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { NextResponse } from "next/server";
import { wcApi } from "@/server/woocommerce";
import { auth } from "@/server/firebase-client";

const baseUrl = process.env.WOO_API_URL;

export const POST = async (request) => {
    try {
        const { email, password } = await request.json();
        if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            return NextResponse.json({ error: "Password must be at least 8 characters long and contain uppercase, lowercase, and number" }, { status: 400 });
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // const wooUser = await createWooCustomer(email);
        // console.log("WooCommerce customer created:", wooUser);
        return NextResponse.json({ message: "User registered successfully", user: { email: user.email, uid: user.uid, user } });
    } catch (error) {
        console.error("Error registering user:", error);
        if (error?.code === "auth/email-already-in-use") {
            return NextResponse.json({ message: "Email already registered! Please log in." }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
    }
};

const createWooCustomer = async (email) => {
    try {
        const response = await wcApi.post(`${baseUrl}/customers`, {
            email: email,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating WooCommerce customer:", error?.response?.data?.message);
        throw new Error("Failed to create WooCommerce customer");
    }
};

