"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LuLoaderCircle, LuStar } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";

const REVIEWS_PER_PAGE = 10;

function StarRating({ value = 0, interactive = false, onChange }) {
  const rating = Number(value) || 0;

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          disabled={!interactive}
          onClick={interactive ? () => onChange(star) : undefined}
          aria-label={interactive ? `Rate ${star} out of 5` : undefined}
          className={interactive ? "transition-transform hover:scale-110" : "cursor-default"}
        >
          <LuStar
            size={interactive ? 20 : 15}
            strokeWidth={1.5}
            className={star <= rating ? "fill-[#b5433a] text-[#b5433a]" : "text-gray-300"}
          />
        </button>
      ))}
    </div>
  );
}

function formatReviewDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function cleanReviewText(value = "") {
  return String(value)
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

export default function ProductReviews({ product }) {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewPagination, setReviewPagination] = useState({ total: 0, totalPages: 0 });
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 0, review: "" });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const reviewerEmail = user?.email || user?.customer?.email || "";
  const reviewerName =
    user?.profile?.name ||
    user?.customer?.first_name ||
    reviewerEmail.split("@")[0] ||
    "Customer";

  useEffect(() => {
    setReviewPage(1);
    setEditingReviewId(null);
    setReviewForm({ rating: 0, review: "" });
    setReviewMessage("");
  }, [product?.id]);

  useEffect(() => {
    if (!product?.id) return;

    let cancelled = false;

    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError("");

      try {
        const { data } = await axios.get("/api/products/reviews", {
          params: {
            product_id: product.id,
            page: reviewPage,
            per_page: REVIEWS_PER_PAGE,
            status: "approved",
            ...(hydrated && reviewerEmail ? { reviewer_email: reviewerEmail } : {}),
          },
        });

        if (cancelled) return;

        setReviews(data?.reviews || []);
        setReviewPagination({
          total: Number(data?.pagination?.total || 0),
          totalPages: Number(data?.pagination?.totalPages || 0),
        });

        if (data?.myReview) {
          setEditingReviewId(data.myReview.id);
          setReviewForm({
            rating: Number(data.myReview.rating || 0),
            review: cleanReviewText(data.myReview.review),
          });
        }
      } catch (error) {
        if (!cancelled) {
          setReviewsError(error?.response?.data?.error || "Unable to load reviews right now.");
        }
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    };

    fetchReviews();
    return () => {
      cancelled = true;
    };
  }, [product?.id, reviewPage, reviewRefreshKey, hydrated, reviewerEmail]);

  const submitReview = async (event) => {
    event.preventDefault();

    if (!hydrated || !user) {
      router.push("/auth");
      return;
    }

    if (!reviewForm.rating || !reviewForm.review.trim()) {
      setReviewMessage("Please select a rating and write a review.");
      return;
    }

    setReviewSubmitting(true);
    setReviewMessage("");

    const payload = {
      product_id: product.id,
      review: reviewForm.review.trim(),
      reviewer: reviewerName,
      reviewer_email: reviewerEmail,
      rating: reviewForm.rating,
    };

    try {
      const response = editingReviewId
        ? await axios.put(`/api/products/reviews?id=${editingReviewId}`, payload)
        : await axios.post("/api/products/reviews", payload);

      const savedReview = response.data?.review;
      if (savedReview?.id) setEditingReviewId(savedReview.id);
      setReviewMessage(editingReviewId ? "Your review has been updated." : "Your review has been submitted for approval.");
      setReviewRefreshKey((value) => value + 1);
    } catch (error) {
      setReviewMessage(error?.response?.data?.error || "Unable to save your review right now.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <section className="border-t border-gray-200 bg-[#faf9f6] px-6 py-14 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Customer notes</p>
            <h2 className="font-serif text-3xl tracking-tight text-gray-900">Reviews</h2>
          </div>
          <div className="flex items-center gap-3">
            <StarRating value={Number(product?.average_rating || 0)} />
            <span className="text-sm text-gray-500">
              {Number(product?.average_rating || 0).toFixed(1)} ({reviewPagination.total || product?.rating_count || 0})
            </span>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <div>
            {reviewsLoading ? (
              <div className="flex items-center gap-2 py-8 text-sm text-gray-500"><LuLoaderCircle className="animate-spin" size={16} />Loading reviews...</div>
            ) : reviewsError ? (
              <p className="py-8 text-sm text-[#b5433a]">{reviewsError}</p>
            ) : reviews.length === 0 ? (
              <p className="py-8 text-sm text-gray-500">No reviews yet. Be the first to share your thoughts.</p>
            ) : (
              <div className="divide-y divide-gray-200 border-y border-gray-200">
                {reviews.map((review) => (
                  <article key={review.id} className="py-5 first:pt-6 last:pb-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3"><StarRating value={review.rating} /><span className="text-sm font-medium text-gray-800">{review.reviewer}</span></div>
                      <time className="text-[11px] text-gray-400" dateTime={review.date_created}>{formatReviewDate(review.date_created)}</time>
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">{cleanReviewText(review.review)}</p>
                    {review.verified && <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-green-600">Verified purchase</p>}
                  </article>
                ))}
              </div>
            )}

            {reviewPagination.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button type="button" onClick={() => setReviewPage((page) => Math.max(1, page - 1))} disabled={reviewPage === 1 || reviewsLoading} className="border border-gray-300 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600 transition-colors hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                <span className="text-[11px] text-gray-400">Page {reviewPage} of {reviewPagination.totalPages}</span>
                <button type="button" onClick={() => setReviewPage((page) => Math.min(reviewPagination.totalPages, page + 1))} disabled={reviewPage === reviewPagination.totalPages || reviewsLoading} className="border border-gray-300 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600 transition-colors hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-40">Next</button>
              </div>
            )}
          </div>

          <div className="border border-gray-200 bg-white p-6 sm:p-7">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">{editingReviewId ? "Your review" : "Share your experience"}</p>
            <h3 className="font-serif text-2xl text-gray-900">{editingReviewId ? "Update your review" : "Write a review"}</h3>
            {hydrated && user ? (
              <form onSubmit={submitReview} className="mt-5 space-y-4">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">Your rating</p>
                  <StarRating value={reviewForm.rating} interactive onChange={(rating) => setReviewForm((form) => ({ ...form, rating }))} />
                </div>
                <textarea value={reviewForm.review} onChange={(event) => setReviewForm((form) => ({ ...form, review: event.target.value }))} placeholder="Tell other customers what you think..." maxLength={5000} rows={5} className="w-full resize-y border border-gray-300 bg-white px-3 py-3 text-sm leading-6 text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-[#b5433a]" />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-gray-400">{reviewForm.review.length}/5000</span>
                  <button type="submit" disabled={reviewSubmitting} className="bg-[#b5433a] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#9b3830] disabled:cursor-not-allowed disabled:opacity-50">{reviewSubmitting ? "Saving..." : editingReviewId ? "Update review" : "Submit review"}</button>
                </div>
                {reviewMessage && <p className="text-xs text-gray-500">{reviewMessage}</p>}
              </form>
            ) : (
              <div className="mt-5">
                <p className="text-sm leading-6 text-gray-500">Sign in to rate this product and share your review.</p>
                <button type="button" onClick={() => router.push("/auth")} className="mt-5 border border-gray-800 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-800 transition-colors hover:bg-gray-800 hover:text-white">Sign in to review</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
