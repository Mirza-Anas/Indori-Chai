import { NextResponse } from "next/server";
import { wcApi } from "@/server/woocommerce";

const baseUrl = process.env.WOO_API_URL;
const MAX_PER_PAGE = 100;

const errorResponse = (error, fallbackMessage) => {
  const status = error?.response?.status || 500;
  const message =
    error?.response?.data?.message || error?.message || fallbackMessage;

  console.error(fallbackMessage, error?.response?.data || error);
  return NextResponse.json({ error: message }, { status });
};

const parsePositiveInteger = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
};

const parseReviewId = (request, payload = {}) => {
  const { searchParams } = new URL(request.url);
  return parsePositiveInteger(searchParams.get("id") || payload.id);
};

const isObjectPayload = (payload) =>
  payload !== null && typeof payload === "object" && !Array.isArray(payload);

const readJsonPayload = async (request) => {
  try {
    const payload = await request.json();
    return isObjectPayload(payload) ? payload : null;
  } catch {
    return null;
  }
};

const sanitizeReviewText = (value) =>
  String(value || "")
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();

const validateReviewPayload = (payload, { partial = false } = {}) => {
  const errors = {};
  const has = (field) => Object.prototype.hasOwnProperty.call(payload, field);

  if (!partial || has("product_id")) {
    if (!parsePositiveInteger(payload.product_id)) {
      errors.product_id = "product_id must be a positive integer";
    }
  }

  if (!partial || has("review")) {
    const reviewText = sanitizeReviewText(payload.review);
    if (
      typeof payload.review !== "string" ||
      reviewText.length < 1 ||
      reviewText.length > 5000
    ) {
      errors.review = "review must be between 1 and 5000 characters";
    }
  }

  if (!partial || has("reviewer")) {
    const reviewer = sanitizeReviewText(payload.reviewer);
    if (
      typeof payload.reviewer !== "string" ||
      reviewer.length < 1 ||
      reviewer.length > 100
    ) {
      errors.reviewer = "reviewer must be between 1 and 100 characters";
    }
  }

  if (!partial || has("reviewer_email")) {
    const email = String(payload.reviewer_email || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.reviewer_email = "reviewer_email must be a valid email address";
    }
  }

  if (!partial || has("rating")) {
    const rating = Number(payload.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      errors.rating = "rating must be an integer from 1 to 5";
    }
  }

  return errors;
};

const createReviewPayload = (payload) => ({
  product_id: parsePositiveInteger(payload.product_id),
  review: sanitizeReviewText(payload.review),
  reviewer: sanitizeReviewText(payload.reviewer),
  reviewer_email: payload.reviewer_email.trim().toLowerCase(),
  rating: Number(payload.rating),
});

const updateReviewPayload = (payload) => {
  const update = {};

  if (Object.prototype.hasOwnProperty.call(payload, "review")) {
    update.review = sanitizeReviewText(payload.review);
  }
  if (Object.prototype.hasOwnProperty.call(payload, "reviewer")) {
    update.reviewer = sanitizeReviewText(payload.reviewer);
  }
  if (Object.prototype.hasOwnProperty.call(payload, "reviewer_email")) {
    update.reviewer_email = payload.reviewer_email.trim().toLowerCase();
  }
  if (Object.prototype.hasOwnProperty.call(payload, "rating")) {
    update.rating = Number(payload.rating);
  }
  if (Object.prototype.hasOwnProperty.call(payload, "status")) {
    update.status = payload.status;
  }

  return update;
};

const findReviewByEmail = async (productId, email) => {
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await wcApi.get(`${baseUrl}/products/reviews`, {
      params: {
        product: productId,
        status: "all",
        page,
        per_page: MAX_PER_PAGE,
      },
    });

    const review = response.data.find(
      (item) => String(item.reviewer_email || "").toLowerCase() === email
    );

    if (review) return review;

    totalPages = Number(response.headers["x-wp-totalpages"] || 0);
    page += 1;
  }

  return null;
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = parsePositiveInteger(searchParams.get("id"));
    const productId = searchParams.get("product_id");
    const status = searchParams.get("status");
    const reviewerEmail = searchParams.get("reviewer_email")?.trim().toLowerCase();
    const page = Number(searchParams.get("page") || 1);
    const perPage = Number(searchParams.get("per_page") || 10);

    if (!Number.isInteger(page) || page < 1) {
      return NextResponse.json(
        { error: "page must be a positive integer" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(perPage) || perPage < 1 || perPage > MAX_PER_PAGE) {
      return NextResponse.json(
        { error: `per_page must be between 1 and ${MAX_PER_PAGE}` },
        { status: 400 }
      );
    }

    if (searchParams.has("id") && !reviewId) {
      return NextResponse.json(
        { error: "id must be a positive integer" },
        { status: 400 }
      );
    }

    if (productId && !parsePositiveInteger(productId)) {
      return NextResponse.json(
        { error: "product_id must be a positive integer" },
        { status: 400 }
      );
    }

    if (reviewerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewerEmail)) {
      return NextResponse.json(
        { error: "reviewer_email must be a valid email address" },
        { status: 400 }
      );
    }

    const validStatuses = ["approved", "hold", "spam", "unspam", "trash"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "status is not valid" },
        { status: 400 }
      );
    }

    const response = await wcApi.get(
      reviewId
        ? `${baseUrl}/products/reviews/${reviewId}`
        : `${baseUrl}/products/reviews`,
      reviewId
        ? undefined
        : {
            params: {
              page,
              per_page: perPage,
              ...(productId ? { product: productId } : {}),
              ...(status ? { status } : {}),
            },
          }
    );

    if (reviewId) {
      return NextResponse.json({ review: response.data });
    }

    const myReview = reviewerEmail && productId
      ? await findReviewByEmail(productId, reviewerEmail)
      : null;

    return NextResponse.json({
      reviews: response.data,
      myReview,
      pagination: {
        page,
        perPage,
        total: Number(response.headers["x-wp-total"] || 0),
        totalPages: Number(response.headers["x-wp-totalpages"] || 0),
      },
    });
  } catch (error) {
    return errorResponse(error, "Failed to fetch reviews");
  }
}

export async function POST(request) {
  try {
    const payload = await readJsonPayload(request);
    if (!payload) {
      return NextResponse.json(
        { error: "A valid JSON object is required" },
        { status: 400 }
      );
    }

    const errors = validateReviewPayload(payload);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Invalid review data", fields: errors },
        { status: 400 }
      );
    }

    const response = await wcApi.post(
      `${baseUrl}/products/reviews`,
      createReviewPayload(payload)
    );

    return NextResponse.json(
      { message: "Review created successfully", review: response.data },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error, "Failed to create review");
  }
}

export async function PUT(request) {
  try {
    const payload = await readJsonPayload(request);
    if (!payload) {
      return NextResponse.json(
        { error: "A valid JSON object is required" },
        { status: 400 }
      );
    }

    const reviewId = parseReviewId(request, payload);

    if (!reviewId) {
      return NextResponse.json(
        { error: "A valid review id is required" },
        { status: 400 }
      );
    }

    const update = updateReviewPayload(payload);
    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "At least one review field is required for update" },
        { status: 400 }
      );
    }

    const errors = validateReviewPayload(payload, { partial: true });
    if (Object.prototype.hasOwnProperty.call(payload, "status")) {
      const validStatuses = ["approved", "hold", "spam", "unspam", "trash"];
      if (!validStatuses.includes(payload.status)) {
        errors.status = "status must be approved, hold, spam, unspam, or trash";
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Invalid review data", fields: errors },
        { status: 400 }
      );
    }

    const response = await wcApi.put(
      `${baseUrl}/products/reviews/${reviewId}`,
      update
    );

    return NextResponse.json({
      message: "Review updated successfully",
      review: response.data,
    });
  } catch (error) {
    return errorResponse(error, "Failed to update review");
  }
}

export async function DELETE(request) {
  try {
    const reviewId = parseReviewId(request);

    if (!reviewId) {
      return NextResponse.json(
        { error: "A valid review id is required" },
        { status: 400 }
      );
    }

    const response = await wcApi.delete(
      `${baseUrl}/products/reviews/${reviewId}`,
      { params: { force: true } }
    );

    return NextResponse.json({
      message: "Review deleted successfully",
      review: response.data,
    });
  } catch (error) {
    return errorResponse(error, "Failed to delete review");
  }
}
