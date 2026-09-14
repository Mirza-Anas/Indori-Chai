"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LuArrowLeft,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
} from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(date))
    : "Date unavailable";

const formatCurrency = (total) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(total || 0));

const getItemsSubtotal = (items = []) =>
  items.reduce(
    (subtotal, item) => subtotal + Number(item.subtotal ?? item.total ?? 0),
    0
  );

export default function OrdersPage() {
  const { user, hydrated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const customerId = user?.customer?.id ?? user?.customer_id;

  useEffect(() => {
    if (!hydrated || !customerId) return;

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `/api/order/fetch-orders?customer_id=${customerId}&page=${page}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch orders");
        }

        setOrders(Array.isArray(data.orders) ? data.orders : []);
        setTotalPages(Number(data.pagination?.totalPages || 0));
        setExpandedOrderId(null);
      } catch (fetchError) {
        setError(fetchError.message || "Failed to fetch orders");
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [customerId, hydrated, page]);

  if (!hydrated) {
    return null;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pt-12">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
          <div className="border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">You are not signed in.</p>
            <Link
              href="/auth"
              className="mt-6 inline-flex items-center justify-center bg-[#b5433a] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#9b3830]"
            >
              Go to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-12">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/user"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 transition-colors hover:text-[#b5433a]"
            >
              <LuArrowLeft size={14} strokeWidth={2} />
              Back to profile
            </Link>
            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500">
              Account
            </p>
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-gray-800">Your Orders</h1>
            <p className="mt-3 text-sm leading-6 text-gray-500">
              Review your recent purchases and order status.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            {totalPages > 0 ? `Page ${page} of ${totalPages}` : "Order history"}
          </p>
        </div>

        <section className="border border-gray-200 bg-white p-6 sm:p-8">
          {isLoading ? (
            <p className="py-12 text-center text-sm text-gray-500">Loading orders...</p>
          ) : error ? (
            <p className="py-12 text-center text-sm text-red-600">{error}</p>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif text-2xl text-gray-800">No orders yet</p>
              <p className="mt-2 text-sm text-gray-500">Your completed purchases will appear here.</p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center justify-center bg-[#b5433a] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#9b3830]"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                        Order #{order.number || order.id}
                      </p>
                      <p className="mt-2 font-serif text-xl text-gray-800">{formatDate(order.date_created)}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {order.line_items?.length || 0} {order.line_items?.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div className="sm:text-right">
                        <p className="text-lg font-medium text-gray-800">{formatCurrency(order.total)}</p>
                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b5433a]">
                          {order.status || "Pending"}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-expanded={expandedOrderId === order.id}
                        aria-label={`${expandedOrderId === order.id ? "Hide" : "View"} details for order ${order.number || order.id}`}
                        onClick={() =>
                          setExpandedOrderId((currentId) =>
                            currentId === order.id ? null : order.id
                          )
                        }
                        className="inline-flex h-10 w-10 items-center justify-center border border-gray-300 text-gray-600 transition-colors hover:border-[#b5433a] hover:text-[#b5433a]"
                      >
                        {expandedOrderId === order.id ? (
                          <LuChevronUp size={18} strokeWidth={1.8} />
                        ) : (
                          <LuChevronDown size={18} strokeWidth={1.8} />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedOrderId === order.id && (
                    <div className="mt-5 border-t border-gray-200 pt-5">
                      <div className="space-y-4">
                        {order.line_items?.map((item) => {
                          const thumbnail = item.image?.src || item.image?.url;
                          const quantity = Number(item.quantity || 1);
                          const lineTotal = Number(item.total ?? item.subtotal ?? 0);
                          const unitPrice = Number(item.price ?? lineTotal / quantity);

                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                            >
                              {thumbnail ? (
                                <img
                                  src={thumbnail}
                                  alt={item.name || "Ordered product"}
                                  className="h-16 w-16 border border-gray-200 object-cover"
                                />
                              ) : (
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-gray-200 bg-[#f0efed] text-center text-[9px] uppercase tracking-[0.12em] text-gray-400">
                                  No image
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-serif text-lg leading-tight text-gray-800">{item.name}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {quantity} × {formatCurrency(unitPrice)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">
                                  {formatCurrency(lineTotal)}
                                </p>
                                <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-gray-400">
                                  Line total
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-5 border-t border-gray-200 pt-4 text-sm">
                        <div className="flex justify-between gap-4 text-gray-500">
                          <span>Items subtotal</span>
                          <span>{formatCurrency(getItemsSubtotal(order.line_items))}</span>
                        </div>
                        <div className="mt-2 flex justify-between gap-4 text-gray-500">
                          <span>Shipping</span>
                          <span>{formatCurrency(order.shipping_total)}</span>
                        </div>
                        <div className="mt-3 flex justify-between gap-4 border-t border-gray-100 pt-3 font-medium text-gray-800">
                          <span>Order total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage - 1)}
                disabled={page === 1}
                className="inline-flex items-center gap-2 border border-gray-300 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <LuChevronLeft size={14} strokeWidth={2} />
                Previous
              </button>
              <span className="text-xs text-gray-500">Page {page}</span>
              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-2 border border-gray-300 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <LuChevronRight size={14} strokeWidth={2} />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
