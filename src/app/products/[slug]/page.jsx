"use client";
import React, { useState, useRef, useEffect } from "react";
import { LuChevronLeft, LuChevronRight, LuShoppingCart, LuShoppingBag } from "react-icons/lu";
import Link from "next/link";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useCart } from "@/context/CartContext";

// ─── Fill these from your WooCommerce API fetch ───────────────────────────────
// Example shape (replace with your actual fetched data):
//
// const product = {
//   name: "Golden Yunnan",
//   subtitle: "ORGANIC BLACK TEA",
//   price: "38.00",                       // string from WooCommerce prices
//   description: "Our finest grade...",
//   images: [{ src: "/tea1.jpg" }, { src: "/tea2.jpg" }],
//   variations: [                         // each variation = one weight option
//     { id: 1, weight: "50g",  price: "19.00" },
//     { id: 2, weight: "100g", price: "38.00" },
//     { id: 3, weight: "250g", price: "89.00" },
//   ],
// };
// ─────────────────────────────────────────────────────────────────────────────

export default function ProductDetail() {
  const pathname = usePathname();
  const { addToCart } = useCart();
  const lastSegment = pathname.split("/").filter(Boolean).pop();
  // ── State ──────────────────────────────────────────────────────────────────
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [weightIndex, setWeightIndex] = useState(0);
  const [product, setProduct] = useState({});

  // Derived
  const [images, setImages] = useState([]);
  const [variations, setVariations] = useState([]);
  const activeVariation = variations[weightIndex] ?? null;

  // Price: if there are variations use variation price, otherwise product price
  const displayPrice = activeVariation?.prices?.price?.slice(0, -2)*quantity ?? product?.prices?.price?.slice  (0, -2)*quantity ?? "—";

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_WOO_OPEN_URL}/products/${lastSegment}`);
      setProduct(data);
      const variationIDs = new Set([]);
      setImages(data?.images ?? []);
      for (const variation of data?.variations ?? []) {
        variationIDs.add(variation.id);
      }
      const WooVars = await axios.get(`${process.env.NEXT_PUBLIC_WOO_OPEN_URL}/products?type=variation`);
      const filteredVariations = WooVars?.data.filter((v) => variationIDs.has(v.id)).reverse();
      setVariations(filteredVariations ?? []);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    try {
      fetchProduct();
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  }, []);

  // ── Refs for GSAP ──────────────────────────────────────────────────────────
  const priceRef = useRef(null);
  const weightLabelRef = useRef(null);
  const imgRef = useRef(null);
  const addCartBtnRef = useRef(null);
  const shopBtnRef = useRef(null);
  const qtyRef = useRef(null);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  function changeWeight(dir) {
    const next = clamp(weightIndex + dir, 0, variations.length - 1);
    if (next === weightIndex) return;

    // Animate price flash on change
    gsap.fromTo(
      priceRef.current,
      { y: dir > 0 ? 10 : -10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35, ease: "power2.out" },
    );
    gsap.fromTo(
      weightLabelRef.current,
      { x: dir > 0 ? 12 : -12, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
    );

    setWeightIndex(next);
  }

  function changeImage(dir) {
    const next = clamp(activeImage + dir, 0, images.length - 1);
    if (next === activeImage) return;

    gsap.fromTo(
      imgRef.current,
      { x: dir > 0 ? 30 : -30, autoAlpha: 0.4 },
      { x: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" },
    );
    setActiveImage(next);
  }

  function changeQuantity(delta) {
    setQuantity((prev) => clamp(prev + delta, 1, 99));
    gsap.fromTo(qtyRef.current, { scale: 0.8 }, { scale: 1, duration: 0.2, ease: "back.out(2)" });
  }

  // ── Button hover animations (attach once) ─────────────────────────────────
  useEffect(() => {
    const btns = [addCartBtnRef.current, shopBtnRef.current].filter(Boolean);
    const handlers = btns.map((btn) => {
      const enter = () => gsap.to(btn, { scale: 1.03, duration: 0.2, ease: "power1.out" });
      const leave = () => gsap.to(btn, { scale: 1, duration: 0.2, ease: "power1.out" });
      btn.addEventListener("mouseenter", enter);
      btn.addEventListener("mouseleave", leave);
      return { btn, enter, leave };
    });
    return () =>
      handlers.forEach(({ btn, enter, leave }) => {
        btn.removeEventListener("mouseenter", enter);
        btn.removeEventListener("mouseleave", leave);
      });
  }, []);

  const updateCart = (product) => {
    addToCart({...product, variation: activeVariation, weight: activeVariation?.weight, quantity});
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-20 font-sans bg-white">
      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        {/* ═══ LEFT — Image panel ══════════════════════════════════════════ */}
        <div className="relative flex items-center justify-center bg-gray-50 min-h-[360px] sm:min-h-[460px] lg:min-h-0">
          {/* ── Back nav ── */}
          <div className="absolute top-0 left-0 z-10 px-6 pt-6 md:px-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold tracking-widest text-gray-800 uppercase transition-colors duration-200 hover:text-gray-1000"
            >
              <LuChevronLeft size={16} strokeWidth={2} />
              Back
            </Link>
          </div>
          {/* Prev arrow */}
          {images.length > 1 && (
            <button
              onClick={() => changeImage(-1)}
              disabled={activeImage === 0}
              className="absolute z-10 p-2 text-gray-400 transition-colors left-4 hover:text-gray-700 disabled:opacity-20"
            >
              <LuChevronLeft size={22} strokeWidth={1.5} />
            </button>
          )}

          {/* Product image */}
          <div className="flex items-center justify-center w-full z-0 min-h-[50vh] sm:h-[calc(100vh-80px)] overflow-hidden">
            {images[activeImage] ? (
              <img
                ref={imgRef}
                src={images[activeImage].src}
                alt={product?.name}
                className="z-0 object-contain w-full select-none drop-shadow-lg"
              />
            ) : (
              <div className="w-64 h-64 bg-gray-200 rounded-full animate-pulse" />
            )}
          </div>

          {/* Next arrow */}
          {images.length > 1 && (
            <button
              onClick={() => changeImage(1)}
              disabled={activeImage === images.length - 1}
              className="absolute z-10 p-2 text-gray-400 transition-colors right-4 hover:text-gray-700 disabled:opacity-20"
            >
              <LuChevronRight size={22} strokeWidth={1.5} />
            </button>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute flex gap-2 bottom-5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === activeImage ? "bg-[#b5433a] scale-125" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ═══ RIGHT — Product info ══════════════════════════════════════════ */}
        <div className="flex flex-col justify-between px-8 py-10 sm:px-12 lg:px-16 lg:py-14">
          {/* ── Tab bar (Description only, static) ── */}
          <div className="mb-8 border-b border-gray-200">
            <div className="inline-block pb-3 border-b-2 border-[#b5433a]">
              <span className="text-sm font-medium tracking-wide text-gray-800">Description</span>
            </div>
          </div>

          {/* ── Name + subtitle ── */}
          <div className="mb-1">
            <h1 className="font-serif text-4xl leading-tight tracking-tight text-gray-900 sm:text-5xl">
              {product?.name ?? <span className="inline-block w-56 h-10 bg-gray-200 rounded animate-pulse" />}
            </h1>
            {product?.subtitle && (
              <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-gray-400">{product.subtitle}</p>
            )}
          </div>

          {/* ── Price ── */}
          <div className="mt-4 mb-6">
            <p ref={priceRef} className="text-3xl font-serif text-[#b5433a]">
              {displayPrice !== "—" ? `₹${displayPrice}` : "—"}
            </p>
          </div>

          {/* ── Description ── */}
          <p className="max-w-md text-sm leading-5 sm:leading-7 sm:text-center text-gray-500 lg:text-left">
            {product?.description ? (
              <span dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <>
                <span className="block w-full h-3 mb-2 bg-gray-100 rounded animate-pulse" />
                <span className="block w-5/6 h-3 mb-2 bg-gray-100 rounded animate-pulse" />
                <span className="block w-4/6 h-3 bg-gray-100 rounded animate-pulse" />
              </>
            )}
          </p>

          {/* ── Selectors row: Weight + Quantity ── */}
          <div className="flex flex-wrap items-end gap-8 mt-8">
            {/* Weight selector */}
            {variations.length > 0 && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3 font-semibold">Weight</p>
                <div className="flex items-center gap-3 px-3 py-2 border border-gray-300 w-36">
                  <button
                    onClick={() => changeWeight(-1)}
                    disabled={weightIndex === 0}
                    className="text-gray-400 transition-colors hover:text-gray-700 disabled:opacity-25"
                  >
                    <LuChevronLeft size={16} strokeWidth={1.5} />
                  </button>
                  <span ref={weightLabelRef} className="flex-1 text-sm font-medium text-center text-gray-700">
                    {activeVariation?.variation?.split(": ")?.[1] ?? "—"}
                  </span>
                  <button
                    onClick={() => changeWeight(1)}
                    disabled={weightIndex === variations.length - 1}
                    className="text-gray-400 transition-colors hover:text-gray-700 disabled:opacity-25"
                  >
                    <LuChevronRight size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3 font-semibold">Quantity</p>
              <div className="flex items-center border border-gray-300">
                <button
                  onClick={() => changeQuantity(-1)}
                  className="px-3 py-2 text-lg leading-none text-gray-400 transition-colors hover:text-gray-700 hover:bg-gray-50"
                >
                  −
                </button>
                <span ref={qtyRef} className="w-10 text-sm font-medium text-center text-gray-700 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => changeQuantity(1)}
                  className="px-3 py-2 text-lg leading-none text-gray-400 transition-colors hover:text-gray-700 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="flex flex-wrap gap-3 mt-10">
            {/* Add to Cart */}
            <button
              ref={addCartBtnRef}
              onClick={() => updateCart(product)}
              className="flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-3.5 border border-gray-800 text-gray-800 text-xs tracking-widest uppercase font-semibold hover:bg-gray-800 hover:text-white transition-colors duration-300"
            >
              <LuShoppingCart size={15} strokeWidth={1.5} />
              Add to Cart
            </button>

            {/* Shop Now */}
            <button
              ref={shopBtnRef}
              className="flex w-full sm:w-auto justify-center items-center gap-2 px-8 py-3.5 bg-[#b5433a] text-white text-xs tracking-widest uppercase font-semibold hover:bg-[#9b3830] transition-colors duration-300"
            >
              <LuShoppingBag size={15} strokeWidth={1.5} />
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
