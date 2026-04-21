import axios from "axios";

export const GET = async () => {
  const auth = Buffer.from(`${process.env.WOO_KEY}:${process.env.WOO_SECRET}`).toString("base64");

  try {
    console.log(process.env.WOO_API_URL);
    const { data } = await axios.get(`${process.env.WOO_API_URL}/products`, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
};
