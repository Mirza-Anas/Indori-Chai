"use client";
import React, { useEffect, useState } from "react";
import { FiMenu, FiX, FiShoppingCart, FiUser } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isProductsPage = pathname.includes("/products") || pathname.includes("/auth") || pathname.includes("/cart");
  const { cart } = useCart();
  const count = cart.length || 0;
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled || isProductsPage ? "backdrop-blur-md bg-white/20 shadow-sm" : "bg-transparent backdrop-blur-xs"
      }`}
    >
      <div className="px-6 mx-auto max-w-8xl md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/indori-chai-logo.png" alt="Logo" className="w-auto h-12" />
          </div>

          {/* Desktop Menu */}
          <div
            className={`hidden md:flex items-center space-x-10 uppercase tracking-wider text-sm transition-colors duration-500 ${
              scrolled || isProductsPage ? "text-black" : "text-white"
            }`}
          >
            <Link href="/" className="font-bold transition hover:opacity-70">
              Home
            </Link>
            <Link href="/products" className="font-bold transition hover:opacity-70">
              Our Products
            </Link>
            <a href="/#AboutUs" className="font-bold transition hover:opacity-70">
              About Us
            </a>
            <a href="/#ContactUs" className="font-bold transition hover:opacity-70">
              Contact Us
            </a>
            {/* <a href="#" className="font-bold transition hover:opacity-70">
              Teaware
            </a> */}
          </div>

          {/* Desktop Icons */}
          <div
            className={`hidden md:flex items-center space-x-6 text-lg transition-colors duration-500 ${
              scrolled || isProductsPage ? "text-black" : "text-white"
            }`}
          >
            <Link href="/cart">
              <div className="relative cursor-pointer">
                <FiShoppingCart strokeWidth={3} className="text-xl transition hover:opacity-70" />

                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] font-bold px-[5px] rounded-full">
                    {count}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/auth">
              <FiUser strokeWidth={3} className="transition cursor-pointer hover:opacity-70" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div
            className={`md:hidden text-2xl transition-colors duration-500 ${scrolled || isProductsPage ? "text-black" : "text-white"}`}
          >
            <button onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <FiX /> : <FiMenu />}</button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? "max-h-96 backdrop-blur-md bg-white/20" : "max-h-0"
        }`}
      >
        <div className="flex flex-col items-center py-6 space-y-6 text-sm tracking-wider text-black uppercase">
          <Link onClick={() => setMenuOpen(!menuOpen)} href="/">
            Home
          </Link>
          <Link onClick={() => setMenuOpen(!menuOpen)} href="/products">
            Our Products
          </Link>
          <Link onClick={() => setMenuOpen(!menuOpen)} href="/#AboutUs">
            About Us
          </Link>
          <Link onClick={() => setMenuOpen(!menuOpen)} href="/#ContactUs">
            Contact Us
          </Link>
          {/* <Link onClick={() => setMenuOpen(!menuOpen)} href="#">
            Teaware
          </Link> */}

          <div className="flex pt-4 space-x-6 text-lg">
            <Link onClick={() => setMenuOpen(!menuOpen)} href="/cart">
              <FiShoppingCart />
            </Link>
            <Link onClick={() => setMenuOpen(!menuOpen)} href="/auth">
              <FiUser />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
