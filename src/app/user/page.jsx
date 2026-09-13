"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LuChevronRight, LuLogOut, LuUser } from "react-icons/lu";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function UserPage() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  useEffect(() => {
    if (user === null) return;
  }, [user]);

  const email = useMemo(() => {
    return user?.email || user?.customer?.email || "";
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const initialName =
      user?.profile?.name ||
      user?.customer?.first_name ||
      user?.customer?.display_name ||
      "";
    const initialPhone =
      user?.profile?.phone ||
      user?.customer?.phone ||
      user?.customer?.billing?.phone ||
      "";

    setName(initialName);
    setPhone(initialPhone);
    setEditingName(false);
    setEditingPhone(false);
  }, [user]);

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

  const displayName = name || "User";

  const handleLogout = () => {
    logout?.();
    toast.success("Logged out successfully");
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      updateUser?.({
        profile: {
          name: name.trim(),
          phone: phone.trim(),
        },
      });
      setEditingName(false);
      setEditingPhone(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
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
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Name</p>
                  <button
                    type="button"
                    onClick={() => setEditingName((prev) => !prev)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 transition-colors hover:text-[#b5433a]"
                  >
                    {editingName ? "Lock" : "Edit"}
                  </button>
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  readOnly={!editingName}
                  className={`mt-2 w-full border px-4 py-3 text-base outline-none transition-colors placeholder:text-gray-400 ${
                    editingName
                      ? "border-gray-300 bg-white text-gray-800 focus:border-[#b5433a]"
                      : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Phone</p>
                  <button
                    type="button"
                    onClick={() => setEditingPhone((prev) => !prev)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 transition-colors hover:text-[#b5433a]"
                  >
                    {editingPhone ? "Lock" : "Edit"}
                  </button>
                </div>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  readOnly={!editingPhone}
                  className={`mt-2 w-full border px-4 py-3 text-base outline-none transition-colors placeholder:text-gray-400 ${
                    editingPhone
                      ? "border-gray-300 bg-white text-gray-800 focus:border-[#b5433a]"
                      : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gray-400">Email</p>
                <input
                  value={email}
                  readOnly
                  className="mt-2 w-full border border-gray-300 bg-gray-50 px-4 py-3 text-base text-gray-500 outline-none cursor-not-allowed"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 bg-[#b5433a] px-5 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#9b3830] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
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
