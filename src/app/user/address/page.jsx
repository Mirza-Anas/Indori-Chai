"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuChevronLeft, LuMapPin, LuSave, LuUser } from "react-icons/lu";
import { toast } from "sonner";
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

const emptyAddress = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "India",
  phone: "",
};

function normalizeAddress(source = {}) {
  return {
    ...emptyAddress,
    ...source,
    country: source?.country || "India",
  };
}

export default function UserAddressPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const customer = user?.customer || null;
  const email = user?.email || customer?.email || "";
  const profile = user?.profile || {};
  const address = user?.address || {};

  const [saving, setSaving] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [shipping, setShipping] = useState(emptyAddress);
  const [billing, setBilling] = useState(emptyAddress);
  const [returnTo, setReturnTo] = useState("/user");

  const displayEmail = useMemo(() => email || "No email available", [email]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextReturnTo = params.get("return");

    if (nextReturnTo) {
      setReturnTo(nextReturnTo);
    }
  }, []);

  useEffect(() => {
    const shippingAddress = normalizeAddress(
      address?.shipping || customer?.shipping || {}
    );
    const billingAddress = normalizeAddress(
      address?.billing || customer?.billing || {}
    );

    if (!shippingAddress.first_name && !shippingAddress.last_name && profile.name) {
      const [firstName = "", ...rest] = profile.name.split(" ");
      shippingAddress.first_name = firstName;
      shippingAddress.last_name = rest.join(" ");
    }

    if (!shippingAddress.phone && profile.phone) {
      shippingAddress.phone = profile.phone;
    }

    if (!billingAddress.first_name && !billingAddress.last_name && profile.name) {
      const [firstName = "", ...rest] = profile.name.split(" ");
      billingAddress.first_name = firstName;
      billingAddress.last_name = rest.join(" ");
    }

    if (!billingAddress.phone && profile.phone) {
      billingAddress.phone = profile.phone;
    }

    setShipping(shippingAddress);
    setBilling(billingAddress);
    setBillingSameAsShipping(
      JSON.stringify(shippingAddress) === JSON.stringify(billingAddress)
    );
  }, [address?.billing, address?.shipping, customer?.billing, customer?.shipping, profile.name, profile.phone]);

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

  const updateField = (section, field, value) => {
    const setter = section === "billing" ? setBilling : setShipping;
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        email,
        first_name: shipping.first_name || billing.first_name || "",
        last_name: shipping.last_name || billing.last_name || "",
        billing: billingSameAsShipping ? shipping : billing,
        shipping,
      };

      const method = customer?.id ? "PUT" : "POST";
      const response = await fetch("/api/customer", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          customer?.id
            ? { ...payload, customer_id: customer.id }
            : payload
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save address");
      }

      const savedCustomer = data?.customer ?? null;
      setShipping(normalizeAddress(savedCustomer?.shipping || shipping));
      setBilling(normalizeAddress(savedCustomer?.billing || (billingSameAsShipping ? shipping : billing)));
      setBillingSameAsShipping(
        JSON.stringify(normalizeAddress(savedCustomer?.shipping || shipping)) ===
          JSON.stringify(normalizeAddress(savedCustomer?.billing || (billingSameAsShipping ? shipping : billing)))
      );
      updateUser?.({
        customer: savedCustomer,
        address: {
          shipping: normalizeAddress(savedCustomer?.shipping || shipping),
          billing: normalizeAddress(savedCustomer?.billing || (billingSameAsShipping ? shipping : billing)),
        },
        profile: {
          name:
            savedCustomer?.first_name ||
            savedCustomer?.display_name ||
            profile.name ||
            "",
          phone:
            savedCustomer?.billing?.phone ||
            savedCustomer?.shipping?.phone ||
            profile.phone ||
            "",
        },
      });

      toast.success("Address saved successfully");
      router.push(returnTo);
    } catch (error) {
      console.error("Failed to save address:", error);
      toast.error(error?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-12">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
        <Link
          href={returnTo}
          className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-500 transition-colors hover:text-gray-700"
        >
          <LuChevronLeft size={13} strokeWidth={1.5} />
          Back
        </Link>

        <div className="mt-6 flex flex-col gap-3 sm:mt-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500">
            Address settings
          </p>
          <h1 className="font-serif text-3xl tracking-tight text-gray-800 sm:text-4xl">
            Manage Address
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Saved address data is pulled from WooCommerce and reused during checkout.
          </p>
        </div>

        <form onSubmit={handleSave} className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <section className="space-y-8">
            <div className="border border-gray-200 bg-white p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#faf9f6] text-gray-600">
                  <LuUser size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-gray-800">Contact</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
                    Email is locked to your account
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    First name
                  </span>
                  <input
                    value={shipping.first_name}
                    onChange={(e) => updateField("shipping", "first_name", e.target.value)}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    Last name
                  </span>
                  <input
                    value={shipping.last_name}
                    onChange={(e) => updateField("shipping", "last_name", e.target.value)}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    Email
                  </span>
                  <input
                    value={displayEmail}
                    readOnly
                    className="w-full cursor-not-allowed border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    Phone
                  </span>
                  <input
                    value={shipping.phone}
                    onChange={(e) => updateField("shipping", "phone", e.target.value)}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                  />
                </label>
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-6 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#faf9f6] text-gray-600">
                  <LuMapPin size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <h2 className="font-serif text-2xl text-gray-800">Shipping address</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
                    Used automatically in checkout
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    Address 1
                  </span>
                  <input
                    value={shipping.address_1}
                    onChange={(e) => updateField("shipping", "address_1", e.target.value)}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    Address 2
                  </span>
                  <input
                    value={shipping.address_2}
                    onChange={(e) => updateField("shipping", "address_2", e.target.value)}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    City
                  </span>
                  <input
                    value={shipping.city}
                    onChange={(e) => updateField("shipping", "city", e.target.value)}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    State
                  </span>
                  <select
                    value={shipping.state}
                    onChange={(e) => updateField("shipping", "state", e.target.value)}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    Postcode
                  </span>
                  <input
                    value={shipping.postcode}
                    onChange={(e) => updateField("shipping", "postcode", e.target.value)}
                    className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                    Country
                  </span>
                  <input
                    value="India"
                    readOnly
                    className="w-full cursor-not-allowed border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                  />
                </label>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="border border-gray-200 bg-white p-6 sm:p-7">
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
                    Uncheck this to enter a separate billing address.
                  </span>
                </span>
              </label>
            </div>

            {!billingSameAsShipping && (
              <div className="border border-gray-200 bg-white p-6 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center border border-gray-200 bg-[#faf9f6] text-gray-600">
                    <LuMapPin size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl text-gray-800">Billing address</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
                      Only if it differs from shipping
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                      Address 1
                    </span>
                    <input
                      value={billing.address_1}
                      onChange={(e) => updateField("billing", "address_1", e.target.value)}
                      className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                      Address 2
                    </span>
                    <input
                      value={billing.address_2}
                      onChange={(e) => updateField("billing", "address_2", e.target.value)}
                      className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                      City
                    </span>
                    <input
                      value={billing.city}
                      onChange={(e) => updateField("billing", "city", e.target.value)}
                      className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                      State
                    </span>
                    <select
                      value={billing.state}
                      onChange={(e) => updateField("billing", "state", e.target.value)}
                      className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                      Postcode
                    </span>
                    <input
                      value={billing.postcode}
                      onChange={(e) => updateField("billing", "postcode", e.target.value)}
                      className="w-full border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none focus:border-[#b5433a]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                      Country
                    </span>
                    <input
                      value="India"
                      readOnly
                      className="w-full cursor-not-allowed border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                    />
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 bg-[#b5433a] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#9b3830] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LuSave size={14} strokeWidth={2} />
              {saving ? "Saving..." : "Save Address"}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}
