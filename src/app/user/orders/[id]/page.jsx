"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LuArrowLeft,
  LuCheck,
  LuCreditCard,
  LuPackage,
  LuRefreshCw,
  LuTruck,
} from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(date))
    : "Date unavailable";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const getItemsSubtotal = (items = []) =>
  items.reduce(
    (subtotal, item) => subtotal + Number(item.subtotal ?? item.total ?? 0),
    0
  );

function AddressCard({ title, address }) {
  if (!address) return null;

  return (
    <section className="border border-gray-200 bg-white p-6 sm:p-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
        {title}
      </p>
      <div className="mt-4 space-y-1 text-sm leading-6 text-gray-600">
        <p className="font-medium text-gray-800">
          {[address.first_name, address.last_name].filter(Boolean).join(" ")}
        </p>
        {address.company && <p>{address.company}</p>}
        {address.address_1 && <p>{address.address_1}</p>}
        {address.address_2 && <p>{address.address_2}</p>}
        <p>
          {[address.city, address.state, address.postcode].filter(Boolean).join(", ")}
        </p>
        {address.country && <p>{address.country}</p>}
        {address.phone && <p className="pt-2">Phone: {address.phone}</p>}
        {address.email && <p>Email: {address.email}</p>}
      </div>
    </section>
  );
}

export default function OrderDetailsPage() {
  const params = useParams();
  const { user, hydrated } = useAuth();
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [paymentState, setPaymentState] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState("");

  const orderId = params?.id;

  useEffect(() => {
    if (!hydrated || !user || !orderId) return;

    const updateOrder = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/order/update-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load order details");
        }

        setOrder(data.order || null);
        setPayment(data.payment || null);
        setPaymentState(data.state || data.order?.status || "");
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    updateOrder();
  }, [hydrated, orderId, user]);

  if (!hydrated) return null;

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pt-12">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-8">
          <p className="border border-gray-200 bg-white p-12 text-center text-sm text-gray-500">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pt-12">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-8">
          <Link
            href="/user/orders"
            className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 transition-colors hover:text-[#b5433a]"
          >
            <LuArrowLeft size={14} strokeWidth={2} />
            Back to orders
          </Link>
          <div className="mt-8 border border-gray-200 bg-white p-12 text-center">
            <p className="text-sm text-red-600">{error || "Order not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = Boolean(order.date_paid) || paymentState === "COMPLETED";
  const itemsSubtotal = getItemsSubtotal(order.line_items);
  const transactionId =
    order.transaction_id ||
    payment?.transactionId ||
    payment?.paymentDetails?.[0]?.transactionId;

  const canRetryPayment = !isPaid && order.payment_method === "online";

  const handleRetryPayment = async () => {
    try {
      setIsRetrying(true);
      setError("");

      const response = await fetch("/api/order/retry-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to retry payment");
      }

      if (!data?.payment?.redirectUrl) {
        throw new Error("PhonePe checkout URL was not returned");
      }

      window.location.assign(data.payment.redirectUrl);
    } catch (retryError) {
      setError(retryError.message || "Failed to retry payment");
      setIsRetrying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-12">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
        <Link
          href="/user/orders"
          className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 transition-colors hover:text-[#b5433a]"
        >
          <LuArrowLeft size={14} strokeWidth={2} />
          Back to orders
        </Link>

        <div className="mt-8 flex flex-col gap-5 border-b border-gray-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500">
              Order details
            </p>
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-gray-800">
              Order #{order.number || order.id}
            </h1>
            <p className="mt-3 text-sm text-gray-500">Placed {formatDate(order.date_created)}</p>
          </div>
          <div className="flex flex-col items-stretch gap-3 self-start sm:items-end sm:self-auto">
            <div className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-3">
              {isPaid && <LuCheck size={15} className="text-green-600" strokeWidth={2.2} />}
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b5433a]">
                {order.status || "Pending"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 border border-gray-300 bg-white px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-700 transition-colors hover:border-[#b5433a] hover:text-[#b5433a]"
              >
                <LuRefreshCw size={14} strokeWidth={1.8} />
                Refresh status
              </button>
              {canRetryPayment && (
                <button
                  type="button"
                  onClick={handleRetryPayment}
                  disabled={isRetrying}
                  className="inline-flex items-center justify-center gap-2 bg-[#b5433a] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#9b3830] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LuCreditCard size={14} strokeWidth={1.8} />
                  {isRetrying ? "Starting payment..." : "Retry payment"}
                </button>
              )}
            </div>
            {error && <p className="text-right text-xs text-red-600">{error}</p>}
          </div>
        </div>

        {!isPaid && (
          <div className="mt-6 flex items-center gap-3 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <LuPackage size={17} strokeWidth={1.8} />
            Payment status: {paymentState || "PENDING"}. This order has not been marked as paid.
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <section className="border border-gray-200 bg-white p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#faf9f6] text-gray-600">
                  <LuPackage size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-gray-800">Items in this order</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
                    {order.line_items?.length || 0} products
                  </p>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {(order.line_items || []).map((item) => {
                  const image = item.image?.src || item.image?.url;
                  const quantity = Number(item.quantity || 1);
                  const lineTotal = Number(item.total ?? item.subtotal ?? 0);
                  const unitPrice = Number(item.price ?? lineTotal / quantity);

                  return (
                    <div key={item.id} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                      {image ? (
                        <img
                          src={image}
                          alt={item.name || "Ordered product"}
                          className="h-20 w-20 shrink-0 border border-gray-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center border border-gray-200 bg-[#f0efed] text-center text-[9px] uppercase tracking-[0.12em] text-gray-400">
                          No image
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-lg leading-tight text-gray-800">{item.name}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          {quantity} x {formatCurrency(unitPrice)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">{formatCurrency(lineTotal)}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-8 sm:grid-cols-2">
              <AddressCard title="Shipping address" address={order.shipping} />
              <AddressCard title="Billing address" address={order.billing} />
            </div>

            {order.customer_note && (
              <section className="border border-gray-200 bg-white p-6 sm:p-7">
                <div className="flex items-center gap-3">
                  <LuTruck size={18} className="text-gray-600" strokeWidth={1.8} />
                  <h2 className="font-serif text-2xl text-gray-800">Order note</h2>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{order.customer_note}</p>
              </section>
            )}
          </div>

          <aside className="h-fit border border-gray-200 bg-white p-6 sm:p-7 lg:sticky lg:top-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">Summary</p>
            <div className="mt-5 space-y-3 border-b border-gray-200 pb-5 text-sm">
              <div className="flex justify-between gap-4 text-gray-500">
                <span>Items subtotal</span>
                <span>{formatCurrency(itemsSubtotal)}</span>
              </div>
              <div className="flex justify-between gap-4 text-gray-500">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount_total)}</span>
              </div>
              <div className="flex justify-between gap-4 text-gray-500">
                <span>Shipping</span>
                <span>{formatCurrency(order.shipping_total)}</span>
              </div>
              <div className="flex justify-between gap-4 text-gray-500">
                <span>Tax</span>
                <span>{formatCurrency(order.total_tax)}</span>
              </div>
              <div className="flex justify-between gap-4 border-t border-gray-200 pt-4 font-medium text-gray-800">
                <span>Total</span>
                <span className="font-serif text-lg">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">Payment</p>
              <div className="flex justify-between gap-4 text-gray-500">
                <span>Method</span>
                <span className="text-right text-gray-800">{order.payment_method_title || order.payment_method || "-"}</span>
              </div>
              <div className="flex justify-between gap-4 text-gray-500">
                <span>Status</span>
                <span className={isPaid ? "text-green-600" : "text-amber-700"}>
                  {isPaid ? "Paid" : paymentState || "Pending"}
                </span>
              </div>
              {order.date_paid && (
                <div className="flex justify-between gap-4 text-gray-500">
                  <span>Paid on</span>
                  <span className="text-right text-gray-800">{formatDate(order.date_paid)}</span>
                </div>
              )}
              {transactionId && (
                <div className="flex justify-between gap-4 text-gray-500">
                  <span>Transaction</span>
                  <span className="max-w-[170px] break-all text-right text-gray-800">{transactionId}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
