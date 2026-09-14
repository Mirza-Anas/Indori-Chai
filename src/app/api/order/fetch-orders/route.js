import { NextResponse } from "next/server";
import { wcApi } from "@/server/woocommerce";

const baseUrl = process.env.WOO_API_URL;
const ORDERS_PER_PAGE = 5;
const FETCH_BATCH_SIZE = 100;

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const getCustomerByEmail = async (email) => {
  const response = await wcApi.get(`${baseUrl}/customers`, {
    params: {
      email,
      per_page: 1,
    },
  });

  return response.data?.[0] ?? null;
};

const fetchCustomerOrders = async (customerId, page) => {
  const response = await wcApi.get(`${baseUrl}/orders`, {
    params: {
      customer: customerId,
      per_page: ORDERS_PER_PAGE,
      page,
      orderby: "date",
      order: "desc",
    },
  });

  return {
    orders: response.data ?? [],
    total: Number(response.headers?.["x-wp-total"] ?? 0),
    totalPages: Number(response.headers?.["x-wp-totalpages"] ?? 0),
  };
};

const fetchOrdersPage = async (page) => {
  const response = await wcApi.get(`${baseUrl}/orders`, {
    params: {
      per_page: FETCH_BATCH_SIZE,
      page,
      orderby: "date",
      order: "desc",
    },
  });

  return {
    orders: response.data ?? [],
    totalPages: Number(response.headers?.["x-wp-totalpages"] ?? 0),
  };
};

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim();
    const page = parsePositiveInt(searchParams.get("page"), 1);

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const targetEmail = normalizeEmail(email);
    const customer = await getCustomerByEmail(targetEmail);

    if (customer?.id) {
      const { orders, total, totalPages } = await fetchCustomerOrders(
        customer.id,
        page
      );

      return NextResponse.json(
        {
          orders,
          customer: {
            id: customer.id,
            email: customer.email,
            first_name: customer.first_name,
            last_name: customer.last_name,
          },
          pagination: {
            page,
            perPage: ORDERS_PER_PAGE,
            total,
            totalPages,
          },
        },
        { status: 200 }
      );
    }

    let allOrders = [];
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const result = await fetchOrdersPage(currentPage);
      allOrders = allOrders.concat(result.orders);
      totalPages = result.totalPages || currentPage;
      currentPage += 1;
    }

    const matchedOrders = allOrders.filter(
      (order) => normalizeEmail(order?.billing?.email) === targetEmail
    );

    const total = matchedOrders.length;
    const matchedTotalPages = Math.max(1, Math.ceil(total / ORDERS_PER_PAGE));
    const safePage = Math.min(page, matchedTotalPages);
    const startIndex = (safePage - 1) * ORDERS_PER_PAGE;
    const orders = matchedOrders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

    return NextResponse.json(
      {
        orders,
        pagination: {
          page: safePage,
          perPage: ORDERS_PER_PAGE,
          total,
          totalPages: matchedTotalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error?.response?.data || error);

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch orders";

    return NextResponse.json({ error: message }, { status });
  }
};
