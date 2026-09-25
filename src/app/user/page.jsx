"use client";

import Link from "next/link";
import { LuChevronRight, LuLogOut, LuUser } from "react-icons/lu";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function UserPage() {
  const { user, logout } = useAuth();
  const customer = user?.customer || null;
  const profile = user?.profile || {};
  const email = user?.email || customer?.email || "";
  const displayName =
    profile.name || customer?.first_name || customer?.display_name || "User";
  const phone =
    profile.phone || customer?.phone || customer?.billing?.phone || customer?.shipping?.phone || "";
  const shippingAddress = user?.address?.shipping || customer?.shipping || null;
  const billingAddress = user?.address?.billing || customer?.billing || null;

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

  const handleLogout = () => {
    logout?.();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-12">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-14">
        <div className="mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gray-500">
            Account
          </p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight text-gray-800">Your Profile</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            This space will later hold your orders and account history.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="border border-gray-200 bg-white p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center border border-gray-200 bg-[#faf9f6] text-gray-600">
                <LuUser size={18} strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="font-serif text-2xl text-gray-800">Profile Details</h2>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gray-400">
                  Logged in account information
                </p>
              </div>
            </div>

            <div className="space-y-5 text-sm">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Name</p>
                <p className="mt-2 text-base text-gray-800">
                  {displayName}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Phone</p>
                <p className="mt-2 text-base text-gray-800">
                  {phone || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Email</p>
                <p className="mt-2 text-base text-gray-800">
                  {email || "Not provided"}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                    Current Address
                  </p>
                  <div className="mt-3 text-sm leading-6 text-gray-700">
                    {shippingAddress || billingAddress ? (
                      <div className="space-y-1">
                        <p className="font-medium text-gray-800">
                          {(
                            shippingAddress?.first_name ||
                            billingAddress?.first_name ||
                            ""
                          ).trim()}{" "}
                          {(
                            shippingAddress?.last_name ||
                            billingAddress?.last_name ||
                            ""
                          ).trim()}
                        </p>
                        <p>
                          {shippingAddress?.address_1 || billingAddress?.address_1 || "No address saved"}
                        </p>
                        <p>
                          {shippingAddress?.address_2 || billingAddress?.address_2
                            ? `${shippingAddress?.address_2 || billingAddress?.address_2}, `
                            : ""}
                          {shippingAddress?.city || billingAddress?.city || ""}
                          {shippingAddress?.state || billingAddress?.state
                            ? `, ${shippingAddress?.state || billingAddress?.state}`
                            : ""}
                        </p>
                        <p>
                          {shippingAddress?.postcode || billingAddress?.postcode || ""}{" "}
                          {shippingAddress?.country || billingAddress?.country || ""}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-400">No address saved yet.</p>
                    )}
                  </div>
                </div>

                <Link
                  href="/user/address?return=/user"
                  className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 transition-colors hover:text-[#b5433a]"
                >
                  Edit address
                </Link>
              </div>
            </div>
          </section>

          <aside className="border border-gray-200 bg-white p-6 sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">Actions</p>
            <div className="mt-5 space-y-3">
              <button
                onClick={handleLogout}
                className="inline-flex w-full items-center justify-center gap-2 bg-[#b5433a] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#9b3830]"
              >
                <LuLogOut size={14} strokeWidth={2} />
                Logout
              </button>

              <Link
                href="/user/orders"
                className="inline-flex w-full items-center justify-center gap-2 border border-gray-300 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                View Orders
                <LuChevronRight size={14} strokeWidth={2} />
              </Link>

              <Link
                href="/products"
                className="inline-flex w-full items-center justify-center gap-2 border border-gray-300 px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                Continue Shopping
                <LuChevronRight size={14} strokeWidth={2} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
