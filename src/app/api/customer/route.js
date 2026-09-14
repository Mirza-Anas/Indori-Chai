import { NextResponse } from "next/server";
import {
  createCustomer,
  getCustomerByEmail,
  updateCustomerById,
} from "@/server/woocommerce-customer";

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const email = normalizeEmail(searchParams.get("email"));

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const customer = await getCustomerByEmail(email);

    return NextResponse.json(
      {
        customer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching customer:", error?.response?.data || error);

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch customer";

    return NextResponse.json({ error: message }, { status });
  }
};

export const POST = async (request) => {
  try {
    const payload = await request.json();
    const customer = await createCustomer(payload);

    return NextResponse.json(
      {
        message: "Customer created successfully",
        customer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating customer:", error?.response?.data || error);

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create customer";

    return NextResponse.json({ error: message }, { status });
  }
};

export const PUT = async (request) => {
  try {
    const payload = await request.json();
    const customerId = Number(payload?.customer_id);
    const email = normalizeEmail(payload?.email);

    let targetId = Number.isInteger(customerId) && customerId > 0 ? customerId : null;

    if (!targetId) {
      if (!email) {
        return NextResponse.json(
          { error: "customer_id or email is required" },
          { status: 400 }
        );
      }

      const existingCustomer = await getCustomerByEmail(email);

      if (!existingCustomer?.id) {
        return NextResponse.json(
          { error: "Customer not found" },
          { status: 404 }
        );
      }

      targetId = existingCustomer.id;
    }

    const customer = await updateCustomerById(targetId, payload);

    return NextResponse.json(
      {
        message: "Customer updated successfully",
        customer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating customer:", error?.response?.data || error);

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update customer";

    return NextResponse.json({ error: message }, { status });
  }
};
