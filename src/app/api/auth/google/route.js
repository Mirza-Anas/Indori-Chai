import { NextResponse } from "next/server";
import {
  createCustomer,
  getCustomerByEmail,
} from "@/server/woocommerce-customer";

export async function POST(request) {
  try {
    const { firebaseIdToken } = await request.json();

    if (!firebaseIdToken) {
      return NextResponse.json(
        { error: "Firebase ID token is required" },
        { status: 400 }
      );
    }

    const tokenResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: firebaseIdToken }),
      }
    );
    const tokenData = await tokenResponse.json();
    const firebaseUser = tokenData?.users?.[0];

    if (!tokenResponse.ok || !firebaseUser?.localId || !firebaseUser?.email) {
      return NextResponse.json(
        { error: "Invalid or expired Firebase ID token" },
        { status: 401 }
      );
    }

    let customer = null;

    if (firebaseUser.email) {
      try {
        customer = await getCustomerByEmail(firebaseUser.email);

        if (!customer?.id) {
          customer = await createCustomer({
            email: firebaseUser.email,
            first_name: firebaseUser.displayName?.split(" ")[0] || "",
            last_name: firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
          });
        }
      } catch (customerError) {
        console.warn(
          "WooCommerce customer lookup/creation failed during Google sign-in:",
          customerError?.response?.data || customerError
        );
      }
    }

    return NextResponse.json(
      {
        message: "Google login successful",
        user: {
          uid: firebaseUser.localId,
          email: firebaseUser.email,
          emailVerified: firebaseUser.emailVerified,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoUrl,
        },
        customer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error signing in with Google:", error);

    return NextResponse.json(
      { error: "Failed to sign in with Google" },
      { status: 500 }
    );
  }
}
