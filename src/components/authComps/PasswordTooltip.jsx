"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { LuCheck, LuX } from "react-icons/lu";

// ── Password rules ────────────────────────────────────────────────────────────
const RULES = [
  { key: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { key: "uppercase", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { key: "lowercase", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "One number", test: (p) => /[0-9]/.test(p) },
];

// ── Password strength tooltip ─────────────────────────────────────────────────
export default function PasswordTooltip({ password, visible }) {
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!tooltipRef.current) return;
    if (visible) {
      gsap.fromTo(
        tooltipRef.current,
        { autoAlpha: 0, y: 6, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" },
      );
    } else {
      gsap.to(tooltipRef.current, {
        autoAlpha: 0,
        y: 4,
        scale: 0.97,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [visible]);

  const passed = RULES.filter((r) => r.test(password)).length;

  const segmentColor = (i) => {
    if (passed === 0) return "#e5e7eb";
    if (passed === 1) return i < passed ? "#ef4444" : "#e5e7eb";
    if (passed === 2) return i < passed ? "#f97316" : "#e5e7eb";
    if (passed === 3) return i < passed ? "#eab308" : "#e5e7eb";
    return "#22c55e"; // all 4 passed
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][passed];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][passed];

  return (
    <div
      ref={tooltipRef}
      className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-gray-200 shadow-lg p-4"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      {/* Strength bar + label */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex gap-1 flex-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors duration-300"
              style={{ backgroundColor: segmentColor(i) }}
            />
          ))}
        </div>
        {passed > 0 && (
          <span
            className="text-[10px] font-semibold tracking-wide uppercase transition-colors duration-300"
            style={{ color: strengthColor }}
          >
            {strengthLabel}
          </span>
        )}
      </div>

      {/* Rules */}
      <ul className="space-y-1.5">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.key} className="flex items-center gap-2">
              <span
                className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-300"
                style={{ backgroundColor: ok ? "#b5433a" : "#f3f4f6" }}
              >
                {ok ? (
                  <LuCheck size={10} className="text-white" strokeWidth={3} />
                ) : (
                  <LuX size={10} className="text-gray-400" strokeWidth={2.5} />
                )}
              </span>
              <span
                className="text-[11px] transition-colors duration-200"
                style={{ color: ok ? "#374151" : "#9ca3af" }}
              >
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}