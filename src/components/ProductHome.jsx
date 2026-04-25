"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ProductHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_WOO_OPEN_URL}/products`);
        setProducts(data);
        setLoading(false);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <section className="pb-10 bg-white" id="Products">
      <div className="w-full px-4 sm:px-6 md:px-12">
        {/* Section Title */}
        <div className="flex flex-row items-center justify-center mb-8 md:mb-12">
          <div className="w-12 sm:w-20 h-0.75 bg-orange-400 mt-2 mr-3 sm:mr-4"></div>
          <h2 className="font-serif text-2xl text-center text-gray-800 sm:text-3xl md:text-4xl">Our Products</h2>
        </div>

        {/* Products Grid */}
        <div className="flex justify-center px-0 sm:px-6 md:px-20">
          {/*
            - Mobile (default): single column, full width
            - Tablet (sm): two columns, smaller gap
            - Desktop (md+): two columns, original large gap
          */}
          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:w-10/12 sm:gap-10 md:gap-24">
            {loading
              ? Array.from({ length: 2 }).map((_, index) => <SkeletonCard key={index} />)
              : products.slice(0, 2).map((product) => (
                  <Link key={product.id} href={`/products/${product.slug}`} className="w-full">
                    <ProductCard key={product.id} product={product} />
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRODUCT CARD ---------------- */
function ProductCard({ product }) {
  return (
    <div className="group cursor-pointer w-full max-w-full md:max-w-[420px] mx-auto">
      {/* Image Section */}
      <div className="relative flex items-center justify-center mx-4 mb-4 md:mb-6">
        {/* Background square */}
        {/* <div className="absolute w-[85%] h-[85%]"></div> */}

        {/* Product Image */}
        <img
          src={product?.images?.[0]?.src}
          alt={product?.name}
          className="z-10 object-contain transition-transform duration-500 w-full max-w-92 sm:max-w-[360px] md:w-104 group-hover:scale-105"
        />
      </div>

      {/* Text Section */}
      <div className="flex items-start gap-3 px-6 sm:gap-5 sm:px-4 md:px-6">
        {/* Accent Line */}
        <div className="w-0.5 h-20 sm:h-24 bg-orange-300 shrink-0"></div>

        {/* Content */}
        <div className="w-full">
          {/* Product Name */}
          <h3 className="mb-2 font-serif text-xl text-gray-800 sm:text-2xl">{product?.name}</h3>

          <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            {/* Price + Weight */}
            <div className="space-y-1">
              <p className="text-base font-semibold text-gray-600 sm:text-lg">
                ₹{product?.prices?.price_range?.min_amount.slice(0, -2)}-
                {product?.prices?.price_range?.max_amount.slice(0, -2)}
              </p>
              <p className="text-xs font-bold text-gray-500 sm:text-sm">Wt: 500gms - 2kg</p>
            </div>

            {/* Button */}
            <div
              href={`/products/${product.slug}`}
              className="px-4 py-2 text-xs font-medium text-gray-900 transition-all duration-300 border border-gray-900 rounded-md sm:px-5 sm:text-sm hover:bg-gray-900 hover:text-white whitespace-nowrap"
            >
              Shop Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- SKELETON CARD ---------------- */
function SkeletonCard() {
  return (
    <div className="p-4 bg-white rounded-lg sm:p-6 animate-pulse">
      <div className="h-56 mb-4 bg-gray-200 rounded sm:mb-6 sm:h-72 md:h-96"></div>

      <div className="flex items-center justify-between gap-x-2">
        <div className="space-y-2">
          <div className="w-40 h-4 bg-gray-200 rounded sm:w-60"></div>
          <div className="w-20 h-3 bg-gray-200 rounded sm:w-28"></div>
        </div>
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
