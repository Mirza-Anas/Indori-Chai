import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { NextResponse } from "next/server";
import { wcApi } from "@/server/woocommerce";
import { auth } from "@/server/firebase-client";

const baseUrl = process.env.WOO_API_URL;

// Simple in-memory rate limiter (per email)
// ⚠️ Replace with Redis in production for scalability
const resendCooldown = new Map();
const RESEND_INTERVAL = 120 * 1000; // 120 seconds

export const POST = async (request) => {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // 🔐 Firebase Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ❗ Check Email Verification
        if (!user.emailVerified) {
            await handleEmailVerification(user);

            return NextResponse.json(
                {
                    error: "Email not verified",
                    message:
                        "Your email is not verified. A verification link has been sent. Please check your inbox or spam folder.",
                },
                { status: 403 }
            );
        }

        // 🛒 Fetch WooCommerce Customer
        const customer = await getWooCustomerByEmail(email);

        return NextResponse.json(
            {
                message: "Login successful",
                user: {
                    uid: user.uid,
                    email: user.email,
                    emailVerified: user.emailVerified,
                },
                customer,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error signing in user:", error);

        if (error?.code === "auth/user-not-found") {
            return NextResponse.json(
                { message: "User not found. Please register." },
                { status: 404 }
            );
        }

        if (error?.code === "auth/wrong-password") {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (error?.code === "auth/invalid-credential") {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "Failed to sign in" },
            { status: 500 }
        );
    }
};

// 📧 Handle Email Verification with Rate Limiting
const handleEmailVerification = async (user) => {
    const now = Date.now();
    const lastSent = resendCooldown.get(user.email);

    if (!lastSent || now - lastSent > RESEND_INTERVAL) {
        await sendEmailVerification(user);
        resendCooldown.set(user.email, now);
    } else {
        console.log("Verification email recently sent. Skipping resend.");
    }
};

// 🛒 Get WooCommerce Customer by Email
const getWooCustomerByEmail = async (email) => {
    try {
        const response = await wcApi.get(`${baseUrl}/customers`, {
            params: { email },
        });

        // Woo returns array
        if (response.data && response.data.length > 0) {
            return response.data[0];
        }

        return null;
    } catch (error) {
        console.error(
            "Error fetching WooCommerce customer:",
            error?.response?.data?.message
        );
        throw new Error("Failed to fetch WooCommerce customer");
    }
};