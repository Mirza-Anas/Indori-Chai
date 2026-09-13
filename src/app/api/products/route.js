import axios from "axios";

export const GET = async (request) => {
  const auth = Buffer.from(`${process.env.WOO_KEY}:${process.env.WOO_SECRET}`).toString("base64");
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  const includeIds = idsParam
    ? idsParam
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];

  try {
    const { data } = await axios.get(`${process.env.WOO_API_URL}/products`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      params: includeIds.length > 0 ? { include: includeIds } : undefined,
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
};
