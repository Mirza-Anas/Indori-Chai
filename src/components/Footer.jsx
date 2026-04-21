import React from "react";
import Link from "next/link";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Cart", href: "/cart" },
  { label: "Login", href: "/login" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Return Policy", href: "/return-policy" },
];

const underlineLink =
  "relative w-fit text-white/80 hover:text-white transition-colors duration-300 " +
  "after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-orange-400 " +
  "after:transition-all after:duration-300 hover:after:w-full";

export default function Footer() {
  return (
    <footer id="ContactUs" className="w-full bg-[#0a0a0a] relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">

        {/* IMAGE — top on mobile, left on desktop */}
        <div className="relative h-[220px] sm:h-[280px] lg:h-auto">
          <img
            src="/footer-image-2.jpeg"
            alt="Tea Setup"
            className="object-cover w-full h-full"
          />
          {/* subtle gradient fade into black on the right edge (desktop only) */}
          <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-linear-to-r from-transparent to-[#0a0a0a]" />
        </div>

        {/* RIGHT / BOTTOM CONTENT */}
        <div className="flex flex-col items-center justify-center gap-8 px-6 py-10 sm:px-10 lg:px-14 lg:py-0">

          {/* ── Nav links ── */}
          <nav>
            <ul className="flex flex-wrap justify-center text-sm gap-x-8 gap-y-4 sm:text-md lg:text-lg">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={underlineLink}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Thin divider ── */}
          <div className="w-16 h-px bg-orange-400/60 sm:w-20" />

          {/* ── Contact info ── */}
          <div className="flex flex-col items-center gap-2 text-sm text-center text-white/70 sm:text-base">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-1">
              <span className="">
                <span className="mr-1 text-xs tracking-widest uppercase text-white/40">Phone</span>
                8823019463
              </span>
              <span>
                <span className="mr-1 text-xs tracking-widest uppercase text-white/40">Email</span>
                indorichai@gmail.com
              </span>
            </div>
            <p className="mt-1 text-xs text-white/50 sm:text-sm">
              37, Silver Colony, Indore, Madhya Pradesh, 452016
            </p>
          </div>

          {/* ── Copyright ── */}
          <p className="text-xs tracking-widest text-center uppercase text-white/30">
            © 2026 Hindustan Consumer Products
          </p>

        </div>
      </div>
    </footer>
  );
}