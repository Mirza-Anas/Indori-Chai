import { NextResponse } from "next/server";
import { wcApi } from "@/server/woocommerce";

const baseUrl = process.env.WOO_API_URL;

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 }
      );
    }

    const productResponse = await wcApi.get(`${baseUrl}/products/${productId}`);
    const product = productResponse.data;

    let variations = [];

    if (product?.type === "variable") {
      const variationsResponse = await wcApi.get(
        `${baseUrl}/products/${productId}/variations`,
        {
          params: {
            per_page: 100,
          },
        }
      );

      variations = variationsResponse.data ?? [];
    }

    return NextResponse.json(
      {
        ...product,
        variations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product:", error?.response?.data || error);

    const status = error?.response?.status || 500;
    const message =
      error?.response?.data?.message || "Failed to fetch product details";

    return NextResponse.json(
      { error: message },
      { status }
    );
  }
};
