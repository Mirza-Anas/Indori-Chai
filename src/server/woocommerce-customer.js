import "server-only";
import { wcApi } from "@/server/woocommerce";

const baseUrl = process.env.WOO_API_URL;
const isLegacyApi = /\/wc-api\//i.test(baseUrl || "");

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const normalizeCountryCode = (value) => {
  const normalized = String(value || "").trim();

  if (!normalized) {
    return "IN";
  }

  if (normalized.toLowerCase() === "india") {
    return "IN";
  }

  return normalized.length === 2 ? normalized.toUpperCase() : normalized;
};

const buildBillingAddress = (address = {}, email = "") => ({
  first_name: address.first_name || "",
  last_name: address.last_name || "",
  company: address.company || "",
  address_1: address.address_1 || "",
  address_2: address.address_2 || "",
  city: address.city || "",
  state: address.state || "",
  postcode: address.postcode || "",
  country: normalizeCountryCode(address.country),
  email: address.email || email || "",
  phone: address.phone || "",
});

const buildShippingAddress = (address = {}) => ({
  first_name: address.first_name || "",
  last_name: address.last_name || "",
  company: address.company || "",
  address_1: address.address_1 || "",
  address_2: address.address_2 || "",
  city: address.city || "",
  state: address.state || "",
  postcode: address.postcode || "",
  country: normalizeCountryCode(address.country),
});

const buildCustomerPayload = (input = {}) => {
  const email = normalizeEmail(input.email);
  const billing = buildBillingAddress(input.billing || {}, email);
  const shipping = buildShippingAddress(input.shipping || {});

  if (isLegacyApi) {
    return {
      customer: {
        email,
        first_name: input.first_name || "",
        last_name: input.last_name || "",
        username: input.username || undefined,
        billing_address: billing,
        shipping_address: shipping,
      },
    };
  }

  return {
    email,
    first_name: input.first_name || "",
    last_name: input.last_name || "",
    username: input.username || undefined,
    billing,
    shipping,
  };
};

const extractCustomerList = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.customers)) {
    return data.customers;
  }

  if (data?.customer) {
    return [data.customer];
  }

  return [];
};

const extractCustomer = (data) => {
  if (data?.customer) {
    return data.customer;
  }

  return data ?? null;
};

export const getCustomerByEmail = async (email) => {
  const response = await wcApi.get(`${baseUrl}/customers`, {
    params: {
      email: normalizeEmail(email),
      per_page: 1,
    },
  });

  return extractCustomerList(response.data)?.[0] ?? null;
};

export const getCustomerById = async (customerId) => {
  const response = await wcApi.get(`${baseUrl}/customers/${customerId}`);
  return extractCustomer(response.data);
};

export const createCustomer = async (input = {}) => {
  const payload = buildCustomerPayload(input);
  const response = await wcApi.post(`${baseUrl}/customers`, payload);
  return extractCustomer(response.data);
};

export const updateCustomerById = async (customerId, input = {}) => {
  const payload = buildCustomerPayload(input);
  const response = await wcApi.put(`${baseUrl}/customers/${customerId}`, payload);
  return extractCustomer(response.data);
};

export const upsertCustomer = async ({ customerId, email, ...input } = {}) => {
  const normalizedEmail = normalizeEmail(email || input.email);

  if (customerId) {
    try {
      const existingById = await getCustomerById(customerId);
      if (existingById?.id) {
        return await updateCustomerById(customerId, {
          ...input,
          email: normalizedEmail || existingById.email,
        });
      }
    } catch (error) {
      console.warn("Customer lookup by id failed, falling back to email:", error?.response?.data || error);
    }
  }

  const existingByEmail = normalizedEmail ? await getCustomerByEmail(normalizedEmail) : null;

  if (existingByEmail?.id) {
    return await updateCustomerById(existingByEmail.id, {
      ...input,
      email: normalizedEmail || existingByEmail.email,
    });
  }

  return await createCustomer({
    ...input,
    email: normalizedEmail,
  });
};
