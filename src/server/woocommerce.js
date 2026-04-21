import axios from "axios";

// 🚨 Ensure this file is server-only
// (optional but recommended)
import "server-only";

const consumerKey = process.env.WOO_KEY;
const consumerSecret = process.env.WOO_SECRET;

const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

export const wcApi = axios.create({
  baseURL: "https://example.com/wp-json/wc/v3",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  },
});