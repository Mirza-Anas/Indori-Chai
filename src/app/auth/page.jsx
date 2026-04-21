"use client";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import { LuChevronLeft } from "react-icons/lu";
import { toast } from "sonner";
import Field from "../../components/authComps/InputField";
import axios from "axios";

// ── Submit button ─────────────────────────────────────────────────────────────
function SubmitButton({ label, onClickFunc }) {
  const ref = useRef(null);
  return (
    <button
      ref={ref}
      type="submit"
      onMouseEnter={() => gsap.to(ref.current, { scale: 1.02, duration: 0.2, ease: "power1.out" })}
      onMouseLeave={() => gsap.to(ref.current, { scale: 1, duration: 0.2, ease: "power1.out" })}
      onMouseDown={() => gsap.to(ref.current, { scale: 0.97, duration: 0.1 })}
      onClick={() => onClickFunc()}
      onMouseUp={() => gsap.to(ref.current, { scale: 1.02, duration: 0.1 })}
      className="w-full py-3.5 bg-[#b5433a] hover:bg-[#9b3830] text-white text-xs tracking-[0.25em] uppercase font-semibold transition-colors duration-300"
    >
      {label}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState("signin");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passTooltipVisible, setPassTooltipVisible] = useState(false);
  const [confirmTooltipVisible, setConfirmTooltipVisible] = useState(false);

  const formRef = useRef(null);
  const indicatorRef = useRef(null);
  const signinBtnRef = useRef(null);
  const signupBtnRef = useRef(null);

  useEffect(() => {
    const activeBtn = mode === "signin" ? signinBtnRef.current : signupBtnRef.current;
    if (!activeBtn || !indicatorRef.current) return;
    gsap.to(indicatorRef.current, {
      x: activeBtn.offsetLeft,
      width: activeBtn.offsetWidth,
      duration: 0.35,
      ease: "power2.out",
    });
  }, [mode]);

  function switchMode(next) {
    if (next === mode) return;
    gsap.fromTo(formRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" });
    setMode(next);
    setShowPass(false);
    setShowConfirm(false);
    setPassTooltipVisible(false);
    setConfirmTooltipVisible(false);
  }

  const signup = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    // Validate password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters with uppercase, lowercase, and a number");
      return;
    }
    // Validate confirm password matches
    if (mode === "signup" && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      if (mode === "signup") {
        const { data } = await axios.post("/api/auth/signup", { email, password });
        toast.success("Account created successfully! Check your email (inbox and spam) for verification.");
        switchMode("signin");
      } else if (mode === "signin") {
        const { data } = await axios.post("/api/auth/signin", { email, password });
        console.log("Signin response:", data);
        toast.success("Signed in successfully!");
      }
    } catch (error) {
      console.log("Signup error:", error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        return;
      }
      toast.error("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* ═══ LEFT — Auth panel ══════════════════════════════════════════════ */}
      <div className="flex flex-col w-full min-h-screen lg:w-1/2">
        <div className="px-8 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LuChevronLeft size={13} strokeWidth={1.5} />
            Back
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 px-8 py-12 sm:px-16">
          <div className="w-full max-w-sm">
            <div className="mb-10 text-center">
              <div className="inline-block w-8 h-px bg-[#b5433a] mb-4" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 font-medium">Indori Chai</p>
            </div>

            {/* Tab switcher */}
            <div className="relative mb-10">
              <div className="flex border-b border-gray-300">
                <button
                  ref={signinBtnRef}
                  onClick={() => switchMode("signin")}
                  className={`flex-1 pb-3 text-sm tracking-wide transition-colors duration-200 ${
                    mode === "signin" ? "text-gray-800 font-semibold" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Sign In
                </button>
                <button
                  ref={signupBtnRef}
                  onClick={() => switchMode("signup")}
                  className={`flex-1 pb-3 text-sm tracking-wide transition-colors duration-200 ${
                    mode === "signup" ? "text-gray-800 font-semibold" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Sign Up
                </button>
              </div>
              <div
                ref={indicatorRef}
                className="absolute bottom-0 h-0.5 bg-[#b5433a] left-0"
                style={{ width: "50%" }}
              />
            </div>

            {/* Form */}
            <form ref={formRef} className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <Field label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

              <Field
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggle
                show={showPass}
                onToggle={() => setShowPass((p) => !p)}
                showTooltip={passTooltipVisible}
                onFocusExtra={() => setPassTooltipVisible(true)}
                onBlurExtra={() => setPassTooltipVisible(false)}
              />

              {mode === "signup" && (
                <Field
                  label="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  toggle
                  show={showConfirm}
                  onToggle={() => setShowConfirm((p) => !p)}
                  showTooltip={confirmTooltipVisible}
                  onFocusExtra={() => setConfirmTooltipVisible(true)}
                  onBlurExtra={() => setConfirmTooltipVisible(false)}
                />
              )}

              {mode === "signin" && (
                <div className="text-right">
                  <a
                    href="#"
                    className="text-[11px] text-gray-500 hover:text-[#b5433a] transition-colors tracking-wide"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <div className="pt-2">
                <SubmitButton label={mode === "signin" ? "Sign In" : "Create Account"} onClickFunc={signup} />
              </div>

              <p className="pt-1 text-xs text-center text-gray-500">
                {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                  className="text-[#b5433a] hover:underline font-medium"
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </form>
          </div>
        </div>

        <div className="px-8 pb-8 text-center">
          <p className="text-[10px] text-gray-400 tracking-widest uppercase">© 2026 Hindustan Consumer Products</p>
        </div>
      </div>

      {/* ═══ RIGHT — Image panel ════════════════════════════════════════════ */}
      <div className="relative hidden overflow-hidden lg:block lg:w-1/2">
        <div className="absolute inset-y-0 left-0 z-10 w-14 bg-linear-to-r from-black/60 to-transparent" />
        <img src="/footer-image-2.jpeg" alt="Tea" className="object-cover w-full h-full" />
        <div className="absolute inset-0 z-20 flex items-end p-14 bg-linear-to-t from-black/60 via-black/10 to-transparent">
          <div>
            <div className="w-8 h-px bg-[#b5433a] mb-4" />
            <p className="max-w-xs font-serif text-2xl leading-snug text-white">
              Every cup tells a story of the land it came from.
            </p>
            <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-white/50">Indori Chai — Since 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
