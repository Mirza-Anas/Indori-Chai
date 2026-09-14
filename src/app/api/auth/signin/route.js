import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { NextResponse } from "next/server";
import { auth } from "@/server/firebase-client";
import { createCustomer, getCustomerByEmail } from "@/server/woocommerce-customer";

const resendCooldown = new Map();
const RESEND_INTERVAL = 120 * 1000;

export const POST = async (request) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

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

    let customer = null;

    try {
      customer = await getCustomerByEmail(user.email);

      if (!customer?.id) {
        customer = await createCustomer({
          email: user.email,
        });
      }
    } catch (customerError) {
      console.warn(
        "WooCommerce customer lookup/creation failed during sign-in:",
        customerError?.response?.data || customerError
      );
    }

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
