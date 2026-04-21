"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuX, LuMinus, LuPlus, LuShoppingBag, LuRefreshCw, LuChevronLeft } from "react-icons/lu";
import { useCart } from "@/context/CartContext";

// ─────────────────────────────────────────────────────────────────────────────
// Utility: calculate cart totals
// ─────────────────────────────────────────────────────────────────────────────
function calculateCartTotals(cartItems = []) {
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item?.variation?.prices?.price / 100 ?? item?.price ?? 0);
    const qty   = parseInt(item?.quantity ?? 1, 10);
    return sum + price * qty;
  }, 0);

  const shipping = 0;  // Free — update logic as needed
  const tax      = 0;  // Add GST logic here if needed
  const total    = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

// ─────────────────────────────────────────────────────────────────────────────
// CartRow
// Mobile : 2-row card — row1: image+name+meta+remove, row2: stepper+total
// Desktop: single horizontal row with all columns
// ─────────────────────────────────────────────────────────────────────────────
function CartRow({ item, onRemove, onQtyChange }) {
  const price     = parseFloat(item?.variation?.prices?.price / 100 ?? 0);
  const qty       = parseInt(item?.quantity ?? 1, 10);
  const lineTotal = price * qty;

  return (
    <div className="py-5 border-b border-gray-300">

      {/* ════ MOBILE (< sm) ════ */}
      <div className="space-y-4 sm:hidden">

        {/* Row 1: image | name + meta | remove */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-16 h-16 bg-[#f0efed] overflow-hidden">
            {item?.images?.[0]?.thumbnail ? (
              <img src={item.images[0].thumbnail} alt={item.name} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full bg-gray-100 animate-pulse" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-serif text-sm leading-snug text-gray-800">{item?.name}</p>
            {item?.variation?.variation && (
              <p className="text-[11px] text-gray-400 tracking-wide mt-0.5">{item.variation.variation}</p>
            )}
            <p className="text-[11px] text-gray-400 mt-1">₹{price.toFixed(2)} each</p>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="shrink-0 mt-0.5 text-gray-400 hover:text-[#b5433a] transition-colors"
            aria-label="Remove item"
          >
            <LuX size={15} strokeWidth={1.5} />
          </button>
        </div>

        {/* Row 2: stepper | line total — indented to align with name */}
        <div className="flex items-center justify-between pl-[76px]">
          <div className="flex items-center border border-gray-400">
            <button
              onClick={() => onQtyChange(item.id, qty - 1)}
              disabled={qty <= 1}
              className="px-3 py-2 text-gray-400 transition-colors hover:text-gray-700 disabled:opacity-30"
            >
              <LuMinus size={11} strokeWidth={2} />
            </button>
            <span className="w-8 text-sm text-center text-gray-700 select-none">{qty}</span>
            <button
              onClick={() => onQtyChange(item.id, qty + 1)}
              className="px-3 py-2 text-gray-400 transition-colors hover:text-gray-700"
            >
              <LuPlus size={11} strokeWidth={2} />
            </button>
          </div>
          <p className="text-sm font-semibold text-gray-800">₹{lineTotal.toFixed(2)}</p>
        </div>

      </div>

      {/* ════ DESKTOP (sm+) ════ */}
      <div className="items-center hidden gap-6 sm:flex">

        <button
          onClick={() => onRemove(item.id)}
          className="shrink-0 text-gray-400 hover:text-[#b5433a] transition-colors duration-200"
          aria-label="Remove item"
        >
          <LuX size={15} strokeWidth={1.5} />
        </button>

        <div className="shrink-0 w-20 h-20 bg-[#f0efed] overflow-hidden">
          {item?.images?.[0]?.thumbnail ? (
            <img src={item.images[0].thumbnail} alt={item.name} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full bg-gray-100 animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-serif text-base leading-snug text-gray-800">{item?.name}</p>
          {item?.variation?.variation && (
            <p className="text-[11px] text-gray-400 tracking-wide mt-0.5">{item.variation.variation}</p>
          )}
        </div>

        <div className="w-20 text-sm text-center text-gray-500 shrink-0">
          ₹{price.toFixed(2)}
        </div>

        <div className="flex items-center border border-gray-400 shrink-0">
          <button
            onClick={() => onQtyChange(item.id, qty - 1)}
            disabled={qty <= 1}
            className="px-2.5 py-2 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
          >
            <LuMinus size={11} strokeWidth={2} />
          </button>
          <span className="w-8 text-sm text-center text-gray-700 select-none">{qty}</span>
          <button
            onClick={() => onQtyChange(item.id, qty + 1)}
            className="px-2.5 py-2 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <LuPlus size={11} strokeWidth={2} />
          </button>
        </div>

        <div className="w-20 text-sm font-semibold text-right text-gray-800 shrink-0">
          ₹{lineTotal.toFixed(2)}
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main cart page
// ─────────────────────────────────────────────────────────────────────────────
export default function CartPage() {
  const router = useRouter();

  const {
    cart: cartItems = [],
    removeFromCart,
    updateQuantity,
    coupon,
    setCoupon,
    applyCoupon,
  } = useCart();

  const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems);
  const isEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen pt-12 bg-[#faf9f6]">
      <div className="max-w-6xl px-4 py-10 mx-auto sm:px-8 sm:py-14">

        <Link
          href="/products"
          className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase text-gray-500 hover:text-gray-700 transition-colors mb-8"
        >
          <LuChevronLeft size={13} strokeWidth={1.5} />
          Back
        </Link>

        <h1 className="mb-8 font-serif text-3xl tracking-tight text-gray-800 sm:text-4xl sm:mb-10">
          Your Cart
        </h1>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <LuShoppingBag size={40} className="mb-4 text-gray-300" strokeWidth={1} />
            <p className="mb-6 text-sm tracking-wide text-gray-500">Your cart is empty.</p>
            <Link
              href="/products"
              className="px-8 py-3 bg-[#b5433a] text-white text-xs tracking-widest uppercase hover:bg-[#9b3830] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-14">

            {/* ══ Left ══ */}
            <div className="flex-1 w-full min-w-0">

              {/* Column headers — desktop only */}
              <div className="items-center hidden gap-6 pb-3 border-b border-gray-400 sm:flex">
                <div className="w-4 shrink-0" />
                <div className="w-20 shrink-0" />
                <div className="flex-1 text-[10px] tracking-[0.15em] uppercase text-gray-500">Product</div>
                <div className="w-20 shrink-0 text-center text-[10px] tracking-[0.15em] uppercase text-gray-500">Price</div>
                <div className="w-24 shrink-0 text-center text-[10px] tracking-[0.15em] uppercase text-gray-500">Quantity</div>
                <div className="w-20 shrink-0 text-right text-[10px] tracking-[0.15em] uppercase text-gray-500">Total</div>
              </div>

              {cartItems.map((item) => (
                <CartRow
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                  onQtyChange={updateQuantity}
                />
              ))}

              {/* Coupon + update */}
              <div className="flex flex-col gap-3 mt-8 sm:flex-row sm:items-center">
                <div className="flex w-full sm:max-w-sm">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={coupon ?? ""}
                    onChange={(e) => setCoupon?.(e.target.value)}
                    className="flex-1 min-w-0 border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#b5433a] transition-colors"
                  />
                  <button
                    onClick={() => applyCoupon?.()}
                    className="shrink-0 px-5 py-2.5 border border-l-0 border-gray-400 bg-white text-[11px] tracking-widest uppercase text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                <button
                  onClick={() => router.refresh()}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-400 bg-white text-[11px] tracking-widest uppercase text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LuRefreshCw size={12} strokeWidth={1.5} />
                  Update Cart
                </button>
              </div>
            </div>

            {/* ══ Right: totals ══ */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0">
              <div className="p-6 bg-white border border-gray-200 sm:p-7">

                <h2 className="text-[11px] tracking-[0.25em] uppercase text-gray-500 font-semibold mb-6">
                  Cart Totals
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-700"}>
                      {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5!">3–5 Business Days</p>

                  <div className="flex items-center justify-between pt-1 text-gray-500">
                    <span>TAX (GST estimated)</span>
                    <span className="text-gray-700">₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-700">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="pt-4 mt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800">Total</span>
                      <span className="font-serif text-lg text-gray-900">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full mt-7 py-3.5 bg-[#b5433a] hover:bg-[#9b3830] text-white text-[11px] tracking-[0.25em] uppercase font-semibold transition-colors duration-300"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/products"
                  className="flex items-center justify-center gap-1 mt-4 text-[11px] tracking-widest uppercase text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <LuChevronLeft size={12} strokeWidth={1.5} />
                  Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}