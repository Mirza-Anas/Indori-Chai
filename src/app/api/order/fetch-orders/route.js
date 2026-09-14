import { NextResponse } from "next/server";
import { wcApi } from "@/server/woocommerce";

const baseUrl = process.env.WOO_API_URL;
const ORDERS_PER_PAGE = 5;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customer_id");
    const page = Number(searchParams.get("page") || 1);

    if (!customerId || !Number.isInteger(page) || page < 1) {
      return NextResponse.json(
        { error: "customer_id and a valid page are required" },
        { status: 400 }
      );
    }

    const response = await wcApi.get(`${baseUrl}/orders`, {
      params: {
        customer: customerId,
        page,
        per_page: ORDERS_PER_PAGE,
        orderby: "date",
        order: "desc",
      },
    });

    return NextResponse.json({
      orders: response.data,
      pagination: {
        page,
        perPage: ORDERS_PER_PAGE,
        total: Number(response.headers["x-wp-total"] || 0),
        totalPages: Number(response.headers["x-wp-totalpages"] || 0),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error?.response?.data || error);

    return NextResponse.json(
      {
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch orders",
      },
      { status: error?.response?.status || 500 }
    );
  }
}
