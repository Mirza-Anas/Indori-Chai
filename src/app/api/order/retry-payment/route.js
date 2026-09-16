import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  MetaInfo,
  PrefillUserLoginDetails,
  StandardCheckoutPayRequest,
} from "@phonepe-pg/pg-sdk-node";
import { phonePeClient } from "@/server/phonepe-class";
import { wcApi } from "@/server/woocommerce";

const baseUrl = process.env.WOO_API_URL;

const parseOrderId = (value) => {
  const orderId = Number(value);
  return Number.isInteger(orderId) && orderId > 0 ? orderId : null;
};

const getMetadataValue = (metadata, key) =>
  metadata?.find((item) => item.key === key)?.value;

const updateMetadataValue = (metadata, key, value) => {
  const existingMetadata = Array.isArray(metadata) ? [...metadata] : [];
  const existingItem = existingMetadata.find((item) => item.key === key);

  if (existingItem) {
    return existingMetadata.map((item) =>
      item.key === key ? { ...item, value: String(value) } : item
    );
  }

  return [...existingMetadata, { key, value: String(value) }];
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

    if (order.payment_method !== "online") {
      return NextResponse.json(
        { error: "Only online payment orders can be retried" },
        { status: 400 }
      );
    }

    if (order.date_paid) {
      return NextResponse.json(
        { error: "This order has already been paid" },
        { status: 409 }
      );
    }

    const currentAttempt = Number(
      getMetadataValue(order.meta_data, "phonepe_payment_attempt") || 0
    );
    const nextAttempt = Number.isInteger(currentAttempt) && currentAttempt > 0
      ? currentAttempt + 1
      : 1;
    const merchantOrderId = `order-${randomUUID()}`;
    const metadataWithMerchantId = updateMetadataValue(
      order.meta_data,
      "phonepe_merchant_order_id",
      merchantOrderId
    );
    const updatedMetadata = updateMetadataValue(
      metadataWithMerchantId,
      "phonepe_payment_attempt",
      nextAttempt
    );

    const updatedOrderResponse = await wcApi.put(`${baseUrl}/orders/${orderId}`, {
      status: "pending",
      set_paid: false,
      meta_data: updatedMetadata,
    });
    const updatedOrder = updatedOrderResponse.data;
    const amountInPaise = Math.round(Number(updatedOrder.total || 0) * 100);

    if (!amountInPaise) {
      throw new Error("Order total must be greater than zero");
    }

    const phoneNumber = String(
      updatedOrder.billing?.phone || updatedOrder.shipping?.phone || ""
    ).trim();
    const redirectUrl = new URL(
      `/user/orders/${orderId}`,
      request.url
    ).toString();

    const payRequestBuilder = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amountInPaise)
      .redirectUrl(redirectUrl)
      .expireAfter(3600)
      .message(`Payment retry ${nextAttempt} for order ${orderId}`);

    if (phoneNumber) {
      payRequestBuilder.prefillUserLoginDetails(
        PrefillUserLoginDetails.builder()
          .phoneNumber(phoneNumber)
          .build()
      );
    }

    payRequestBuilder.metaInfo(
      MetaInfo.builder()
        .udf1(String(orderId))
        .udf2(merchantOrderId)
        .udf3(String(nextAttempt))
        .build()
    );

    const paymentResponse = await phonePeClient.pay(
      payRequestBuilder.build()
    );
    const checkoutPageUrl =
      paymentResponse?.redirectUrl || paymentResponse?.redirect_url;

    if (!checkoutPageUrl) {
      throw new Error("PhonePe did not return a checkout URL");
    }

    return NextResponse.json({
      message: "Payment retry initiated",
      order: updatedOrder,
      payment: {
        provider: "phonepe",
        merchantOrderId,
        attempt: nextAttempt,
        redirectUrl: checkoutPageUrl,
      },
    });
  } catch (error) {
    console.error("Error retrying payment:", error?.response?.data || error);

    return NextResponse.json(
      {
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to retry payment",
      },
      { status: error?.response?.status || 500 }
    );
  }
}
