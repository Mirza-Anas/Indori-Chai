import { NextResponse } from "next/server";
import { wcApi } from "@/server/woocommerce";

const baseUrl = process.env.WOO_API_URL;

const PAYMENT_METHODS = {
  cod: {
    payment_method: "cod",
    payment_method_title: "Cash on Delivery",
    status: "processing",
    set_paid: false,
  },
  online: {
    payment_method: "online",
    payment_method_title: "Online Payment",
    status: "pending",
    set_paid: false,
  },
};

const parseId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const buildAddress = (address = {}) => ({
  first_name: address.first_name || "",
  last_name: address.last_name || "",
  company: address.company || "",
  address_1: address.address_1 || "",
  address_2: address.address_2 || "",
  city: address.city || "",
  state: address.state || "",
  postcode: address.postcode || "",
  country: address.country || "India",
  email: address.email || "",
  phone: address.phone || "",
});

const fetchProductPricing = async (item) => {
  const productId = parseId(item?.product_id);
  const variationId = parseId(item?.variation_id);
  const quantity = Number(item?.quantity || 1);

  if (!productId || quantity <= 0) {
    throw new Error("Each item must have a valid product_id and quantity");
  }

  const productResponse = await wcApi.get(`${baseUrl}/products/${productId}`);
  const product = productResponse.data;

  if (!product) {
    throw new Error(`Product ${productId} not found`);
  }

  if (variationId) {
    const variationResponse = await wcApi.get(
      `${baseUrl}/products/${productId}/variations/${variationId}`
    );
    const variation = variationResponse.data;

    if (!variation) {
      throw new Error(`Variation ${variationId} not found for product ${productId}`);
    }

    return {
      product_id: productId,
      variation_id: variationId,
      quantity,
      name: product.name,
      price: Number(variation.price || variation.regular_price || 0),
    };
  }

  return {
    product_id: productId,
    quantity,
    name: product.name,
    price: Number(product.price || product.regular_price || 0),
  };
};

export const POST = async (request) => {
  try {
    const payload = await request.json();
    const {
      billing = {},
      shipping = {},
      items = [],
      payment_method,
      customer_id,
      customer_note = "",
    } = payload || {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "At least one order item is required" },
        { status: 400 }
      );
    }

    const paymentConfig = PAYMENT_METHODS[payment_method];

    if (!paymentConfig) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    const lineItems = await Promise.all(items.map(fetchProductPricing));

    const orderData = {
      payment_method: paymentConfig.payment_method,
      payment_method_title: paymentConfig.payment_method_title,
      set_paid: paymentConfig.set_paid,
      status: paymentConfig.status,
      customer_id: parseId(customer_id) || undefined,
      billing: buildAddress(billing),
      shipping: buildAddress(shipping),
      customer_note,
      line_items: lineItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        ...(item.variation_id ? { variation_id: item.variation_id } : {}),
      })),
    };

    const { data } = await wcApi.post(`${baseUrl}/orders`, orderData);

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error?.response?.data || error);

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create order";

    return NextResponse.json({ error: message }, { status });
  }
};
