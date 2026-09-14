import "server-only";
import { wcApi } from "@/server/woocommerce";

const baseUrl = process.env.WOO_API_URL;

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

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

const buildCustomerPayload = (input = {}) => {
  const email = normalizeEmail(input.email);

  return {
    email,
    first_name: input.first_name || "",
    last_name: input.last_name || "",
    username: input.username || undefined,
    billing: buildAddress(input.billing || {}),
    shipping: buildAddress(input.shipping || {}),
  };
};

export const getCustomerByEmail = async (email) => {
  const response = await wcApi.get(`${baseUrl}/customers`, {
    params: {
      email: normalizeEmail(email),
      per_page: 1,
    },
  });

  return response.data?.[0] ?? null;
};

export const getCustomerById = async (customerId) => {
  const response = await wcApi.get(`${baseUrl}/customers/${customerId}`);
  return response.data ?? null;
};

export const createCustomer = async (input = {}) => {
  const payload = buildCustomerPayload(input);
  const response = await wcApi.post(`${baseUrl}/customers`, payload);
  return response.data ?? null;
};

export const updateCustomerById = async (customerId, input = {}) => {
  const payload = buildCustomerPayload(input);
  const response = await wcApi.put(`${baseUrl}/customers/${customerId}`, payload);
  return response.data ?? null;
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
