import { NextResponse } from "next/server";
import { phonePeClient } from "@/server/phonepe-class";
import { wcApi } from "@/server/woocommerce";

const baseUrl = process.env.WOO_API_URL;

const parseOrderId = (value) => {
  const orderId = Number(value);
  return Number.isInteger(orderId) && orderId > 0 ? orderId : null;
};

export async function POST(request) {
  try {
    const payload = await request.json();
    const orderId = parseOrderId(payload?.orderId ?? payload?.order_id);

    if (!orderId) {
      return NextResponse.json(
        { error: "A valid orderId is required" },
        { status: 400 }
      );
    }

    const orderResponse = await wcApi.get(
      `${baseUrl}/orders/${orderId}?filter[meta]=true&_=${Date.now()}`,
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
    const order = orderResponse.data;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.date_paid) {
      return NextResponse.json({
        message: "Order is already paid",
        order,
        state: "COMPLETED",
      });
    }

    if (order.payment_method !== "online") {
      return NextResponse.json({
        message: "Order does not use online payment",
        order,
        state: order.date_paid ? "COMPLETED" : order.status?.toUpperCase(),
      });
    }
    console.log(order);
    const merchantOrderId =
      order.meta_data?.find(
        (meta) => meta.key === "phonepe_merchant_order_id"
      )?.value || String(orderId);
    console.log("Checking payment status for order", orderId, "with merchantOrderId", merchantOrderId);
    const paymentResponse = await phonePeClient.getOrderStatus(merchantOrderId);
    const paymentState = String(paymentResponse?.state || "").toUpperCase();
    if (paymentState !== "COMPLETED") {
      return NextResponse.json({
        message: "Payment is not completed",
        order,
        state: paymentState || "UNKNOWN",
        payment: paymentResponse,
      });
    }

    const transactionId =
      paymentResponse?.transactionId ||
      paymentResponse?.paymentDetails?.[0]?.transactionId;

    const updateResponse = await wcApi.put(`${baseUrl}/orders/${orderId}`, {
      status: "processing",
      set_paid: true,
      ...(transactionId ? { transaction_id: transactionId } : {}),
    });

    return NextResponse.json({
      message: "Order marked as paid and processing",
      order: updateResponse.data,
      state: paymentState,
      merchantOrderId,
      payment: paymentResponse,
    });
  } catch (error) {
    console.error("Error updating order payment:", error?.response?.data || error);

    return NextResponse.json(
      {
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update order payment",
      },
      { status: error?.response?.status || 500 }
    );
  }
}
