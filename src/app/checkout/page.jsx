"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import gsap from "gsap";
import {
  LuArrowRight,
  LuBanknote,
  LuChevronLeft,
  LuCreditCard,
  LuMapPin,
  LuPackage,
  LuShieldCheck,
  LuShoppingBag,
  LuTruck,
  LuUser,
} from "react-icons/lu";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

function calculateCartTotals(cartItems = []) {
  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item?.variation?.prices?.price / 100 ?? item?.price ?? 0);
    const qty = parseInt(item?.quantity ?? 1, 10);
    return sum + price * qty;
  }, 0);

  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

function buildAddress(formData, prefix) {
  return {
    first_name: String(formData.get(`${prefix}_first_name`) || "").trim(),
    last_name: String(formData.get(`${prefix}_last_name`) || "").trim(),
    address_1: String(formData.get(`${prefix}_address_1`) || "").trim(),
    address_2: String(formData.get(`${prefix}_address_2`) || "").trim(),
    city: String(formData.get(`${prefix}_city`) || "").trim(),
    state: String(formData.get(`${prefix}_state`) || "").trim(),
    postcode: String(formData.get(`${prefix}_postcode`) || "").trim(),
    country: String(formData.get(`${prefix}_country`) || "India").trim() || "India",
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
  };
}

function buildOrderItems(cartItems = []) {
  return cartItems.map((item) => {
    const productId = Number(item?.id);
    const variationId = Number(item?.variation?.id ?? item?.variation_id ?? 0);

    const orderItem = {
      product_id: productId,
      quantity: Number(item?.quantity ?? 1),
    };

    if (Number.isFinite(variationId) && variationId > 0) {
      orderItem.variation_id = variationId;
    }

    return orderItem;
  });
}

function formatMoney(value) {
  return `₹${Number(value || 0).toFixed(2)}`;
}

function CheckoutField({ label, name, type = "text", placeholder, autoComplete, ...inputProps }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
        {label}
      </span>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...inputProps}
        className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-[#b5433a]"
      />
    </label>
  );
}

function CheckoutSelect({ label, name, autoComplete, children, disabled = false }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
        {label}
      </span>
      <select
        name={name}
        autoComplete={autoComplete}
        disabled={disabled}
        className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-[#b5433a] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
      >
        {children}
      </select>
    </label>
  );
}

function CheckoutTextarea({ label, name, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-none border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-[#b5433a]"
      />
    </label>
  );
}

function AddressSection({ title, eyebrow, icon: Icon, prefix }) {
  return (
    <section className="border border-gray-200 bg-white p-6 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#faf9f6] text-gray-600">
          <Icon size={18} strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="font-serif text-2xl text-gray-800">{title}</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">{eyebrow}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CheckoutField
          label="First name"
          name={`${prefix}_first_name`}
          placeholder="Aarav"
          autoComplete={`${prefix} given-name`}
        />
        <CheckoutField
          label="Last name"
          name={`${prefix}_last_name`}
          placeholder="Sharma"
          autoComplete={`${prefix} family-name`}
        />
        <div className="sm:col-span-2">
          <CheckoutField
            label="Address 1"
            name={`${prefix}_address_1`}
            placeholder="House / flat no., street, area"
            autoComplete={`${prefix} address-line1`}
          />
        </div>
        <div className="sm:col-span-2">
          <CheckoutField
            label="Address 2"
            name={`${prefix}_address_2`}
            placeholder="Landmark, building name, etc. (optional)"
            autoComplete={`${prefix} address-line2`}
          />
        </div>
        <CheckoutField label="City" name={`${prefix}_city`} placeholder="Indore" autoComplete={`${prefix} address-level2`} />
        <CheckoutSelect label="State" name={`${prefix}_state`} autoComplete={`${prefix} address-level1`}>
          <option value="">Select state</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </CheckoutSelect>
        <CheckoutField
          label="Postcode"
          name={`${prefix}_postcode`}
          placeholder="452001"
          autoComplete={`${prefix} postal-code`}
        />
        <CheckoutField
          label="Country"
          name={`${prefix}_country`}
          value="India"
          readOnly
          autoComplete={`${prefix} country`}
          placeholder="India"
        />
      </div>
    </section>
  );
}

function PaymentOption({ id, title, description, icon: Icon, selected, onSelect }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 border p-4 transition-colors ${
        selected ? "border-[#b5433a] bg-[#fbf6f4]" : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      <input
        type="radio"
        name="payment_method"
        value={id}
        checked={selected}
        onChange={() => onSelect(id)}
        className="mt-1 h-4 w-4 border-gray-400 text-[#b5433a] focus:ring-[#b5433a]"
      />
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center border border-gray-300 bg-white text-gray-600">
        <Icon size={16} strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-800">{title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-gray-500">{description}</span>
      </span>
    </label>
  );
}

function OrderItem({ item }) {
  const price = parseFloat(item?.variation?.prices?.price / 100 ?? item?.price ?? 0);
  const qty = parseInt(item?.quantity ?? 1, 10);
  const lineTotal = price * qty;

  return (
    <div className="flex gap-3 border-b border-gray-200 py-4 last:border-b-0">
      <div className="h-16 w-16 shrink-0 overflow-hidden bg-[#f0efed]">
        {item?.images?.[0]?.thumbnail ? (
          <img src={item.images[0].thumbnail} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full animate-pulse bg-gray-100" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-serif text-sm leading-snug text-gray-800">{item?.name}</p>
            {item?.variation?.variation && (
              <p className="mt-0.5 text-[11px] tracking-wide text-gray-400">{item.variation.variation}</p>
            )}
            <p className="mt-1 text-[11px] text-gray-400">
              {formatMoney(price)} each · Qty {qty}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-gray-800">{formatMoney(lineTotal)}</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const pageRef = useRef(null);
  const { cart: cartItems = [], clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems);
  const isEmpty = cartItems.length === 0;

  useEffect(() => {
    if (!pageRef.current) return;

    const items = pageRef.current.querySelectorAll("[data-animate]");
    gsap.fromTo(
      items,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power2.out" }
    );
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEmpty) {
      toast.error("Your cart is empty.");
      return;
    }

    if (paymentMethod !== "cod") {
      toast.info("Online payment is not connected yet. Please use Cash on Delivery for now.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const shippingAddress = buildAddress(formData, "shipping");
    const billingAddress = billingSameAsShipping
      ? shippingAddress
      : buildAddress(formData, "billing");

    const customerId = Number(user?.customer?.id ?? user?.customer_id ?? 0);
    const customerNote = String(formData.get("order_notes") || "").trim();

    const payload = {
      billing: billingAddress,
      shipping: shippingAddress,
      items: buildOrderItems(cartItems),
      payment_method: "cod",
      customer_note: customerNote,
      ...(Number.isFinite(customerId) && customerId > 0 ? { customer_id: customerId } : {}),
    };

    try {
      setIsSubmitting(true);
      const createOrderPromise = fetch("/api/order/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to create order");
        }

        return data;
      });

      toast.promise(createOrderPromise, {
        loading: "Placing your order...",
        success: (result) =>
          `Order placed successfully${result?.order?.id ? ` #${result.order.id}` : ""}.`,
        error: (error) => error?.message || "Failed to place the order",
      });

      await createOrderPromise;
      clearCart?.();
      router.push("/products");
    } catch (error) {
      console.error("Checkout order error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pt-12">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
          <Link
            href="/cart"
            className="mb-8 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-500 transition-colors hover:text-gray-700"
          >
            <LuChevronLeft size={13} strokeWidth={1.5} />
            Back to cart
          </Link>

          <div className="mx-auto max-w-2xl border border-gray-200 bg-white p-8 text-center">
            <LuShoppingBag size={42} className="mx-auto mb-4 text-gray-300" strokeWidth={1} />
            <h1 className="font-serif text-3xl tracking-tight text-gray-800">Checkout</h1>
            <p className="mt-3 text-sm text-gray-500">Your cart is empty, so there is nothing to checkout yet.</p>
            <Link
              href="/products"
              className="mt-7 inline-flex items-center justify-center bg-[#b5433a] px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#9b3830]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#faf9f6] pt-12">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
        <div data-animate>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-500 transition-colors hover:text-gray-700"
          >
            <LuChevronLeft size={13} strokeWidth={1.5} />
            Back to cart
          </Link>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500">
              Secure checkout
            </p>
            <h1 className="font-serif text-3xl tracking-tight text-gray-800 sm:text-4xl">Checkout</h1>
            <p className="max-w-2xl text-sm leading-6 text-gray-500">
              Enter your contact details and shipping address, then choose how you want to pay.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
          <div className="flex-1 space-y-8 min-w-0">
            <section data-animate className="border border-gray-200 bg-white p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#faf9f6] text-gray-600">
                  <LuUser size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-gray-800">Customer / Contact</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
                    We’ll use this to confirm the order
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <CheckoutField
                  label="First name"
                  name="first_name"
                  placeholder="Aarav"
                  autoComplete="given-name"
                  required
                />
                <CheckoutField
                  label="Last name"
                  name="last_name"
                  placeholder="Sharma"
                  autoComplete="family-name"
                  required
                />
                <CheckoutField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="aarav@example.com"
                  autoComplete="email"
                  required
                />
                <CheckoutField
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98xxxxxx10"
                  autoComplete="tel"
                  required
                />
              </div>
            </section>

            <AddressSection
              title="Shipping address"
              eyebrow="Where should we deliver your order?"
              icon={LuMapPin}
              prefix="shipping"
            />

            <section data-animate className="border border-gray-200 bg-white p-6 sm:p-7">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={billingSameAsShipping}
                  onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  className="mt-1 h-4 w-4 border-gray-400 text-[#b5433a] focus:ring-[#b5433a]"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-800">
                    Billing address is the same as shipping address
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                    Uncheck this if you want to enter a different billing address.
                  </span>
                </span>
              </label>
            </section>

            {!billingSameAsShipping && (
              <div data-animate>
                <AddressSection
                  title="Billing address"
                  eyebrow="Enter a different billing address"
                  icon={LuPackage}
                  prefix="billing"
                />
              </div>
            )}

            <section data-animate className="border border-gray-200 bg-white p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#faf9f6] text-gray-600">
                  <LuTruck size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-gray-800">Delivery note</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
                    Optional instructions for the delivery partner
                  </p>
                </div>
              </div>

              <CheckoutTextarea
                label="Order notes"
                name="order_notes"
                placeholder="Gate code, delivery preference, or any helpful instructions..."
                rows={4}
              />
            </section>
          </div>

          <aside data-animate className="w-full shrink-0 lg:w-[380px]">
            <div className="sticky top-8 space-y-6 border border-gray-200 bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">Order summary</p>
                  <h2 className="mt-2 font-serif text-2xl text-gray-800">Your items</h2>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#faf9f6] text-gray-600">
                  <LuPackage size={18} strokeWidth={1.8} />
                </span>
              </div>

              <div className="max-h-[360px] space-y-0 overflow-auto pr-1">
                {cartItems.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-200 pt-5 text-sm">
                <div className="flex items-center justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-700">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "font-medium text-green-600" : "text-gray-700"}>
                    {shipping === 0 ? "Free" : formatMoney(shipping)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span>GST estimated</span>
                  <span className="text-gray-700">{formatMoney(tax)}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-800">Total</span>
                    <span className="font-serif text-lg text-gray-900">{formatMoney(total)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center border border-gray-200 bg-[#faf9f6] text-gray-600">
                    <LuCreditCard size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl text-gray-800">Payment</h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-gray-400">
                      Select a payment method
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <PaymentOption
                    id="cod"
                    title="Cash on delivery"
                    description="Pay the rider when your order arrives."
                    icon={LuBanknote}
                    selected={paymentMethod === "cod"}
                    onSelect={setPaymentMethod}
                  />
                  <PaymentOption
                    id="online"
                    title="Online payment"
                    description="Pay securely with card, UPI, or net banking."
                    icon={LuShieldCheck}
                    selected={paymentMethod === "online"}
                    onSelect={setPaymentMethod}
                  />
                </div>
              </div>

              {paymentMethod === "cod" ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 bg-[#b5433a] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-[#9b3830]"
                >
                  {isSubmitting ? "Placing order..." : "Place order"}
                  <LuArrowRight size={13} strokeWidth={2} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 bg-[#b5433a] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors duration-300 hover:bg-[#9b3830]"
                >
                  {isSubmitting ? "Processing..." : "Proceed to pay"}
                  <LuArrowRight size={13} strokeWidth={2} />
                </button>
              )}

              <Link
                href="/cart"
                className="flex items-center justify-center gap-1 text-[11px] uppercase tracking-widest text-gray-400 transition-colors hover:text-gray-600"
              >
                <LuChevronLeft size={12} strokeWidth={1.5} />
                Return to cart
              </Link>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
