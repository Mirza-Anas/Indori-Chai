import { useRef } from "react";
import gsap from "gsap";
import PasswordTooltip from "./PasswordTooltip";
import { LuEye, LuEyeOff } from "react-icons/lu";

// ── Input field ───────────────────────────────────────────────────────────────
export default function Field({ label, type, value, onChange, toggle, show, onToggle, showTooltip, onFocusExtra, onBlurExtra }) {
  const inputRef = useRef(null);
  const lineRef = useRef(null);

  function handleFocus() {
    gsap.to(lineRef.current, { scaleX: 1, duration: 0.3, ease: "power2.out" });
    onFocusExtra?.();
  }
  function handleBlur() {
    if (!inputRef.current.value) {
      gsap.to(lineRef.current, { scaleX: 0, duration: 0.3, ease: "power2.in" });
    }
    onBlurExtra?.();
  }

  return (
    <div className="relative group">
      <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-2 font-medium">{label}</label>
      <div className="relative flex items-center border border-gray-300 bg-gray-50/60 focus-within:bg-white transition-colors duration-200">
        <input
          ref={inputRef}
          type={toggle ? (show ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full bg-transparent px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-400"
          placeholder={label}
          required
        />
        {toggle && (
          <button type="button" onClick={onToggle} className="pr-4 text-gray-400 hover:text-gray-500 transition-colors">
            {show ? <LuEyeOff size={15} /> : <LuEye size={15} />}
          </button>
        )}
        <div
          ref={lineRef}
          className="absolute bottom-0 left-0 h-0.5 w-full bg-[#b5433a] origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Tooltip — only for password fields */}
      {toggle && <PasswordTooltip password={value} visible={showTooltip} />}
    </div>
  );
}