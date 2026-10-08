"use client";

import { LuChevronLeft, LuChevronRight, LuShoppingBag, LuShoppingCart } from "react-icons/lu";

export default function ProductInfo({
  product,
  activeVariation,
  variations,
  weightIndex,
  quantity,
  displayPrice,
  priceRef,
  weightLabelRef,
  qtyRef,
  addCartBtnRef,
  shopBtnRef,
  hasAddedToCart,
  onWeightChange,
  onQuantityChange,
  onCartClick,
  onShopNow,
}) {
  return (
    <div className="flex flex-col justify-start px-8 py-8 sm:px-12 lg:px-16 lg:py-6">
      <div className="mb-6 border-b border-gray-200">
        <div className="inline-block pb-3 border-b-2 border-[#b5433a]">
          <span className="text-sm font-medium tracking-wide text-gray-800">Description</span>
        </div>
      </div>

      <div className="mb-0">
        <h1 className="font-serif text-4xl leading-tight tracking-tight text-gray-900 sm:text-5xl">
          {product?.name ?? <span className="inline-block w-56 h-10 bg-gray-200 rounded animate-pulse" />}
        </h1>
        {product?.subtitle && <p className="mt-2 text-[11px] tracking-[0.2em] uppercase text-gray-400">{product.subtitle}</p>}
      </div>

      <div className="mt-3 mb-5">
        <p ref={priceRef} className="text-3xl font-serif text-[#b5433a]">
          {displayPrice != null ? `\u20B9${displayPrice}` : "\u2014"}
        </p>
      </div>

      <p className="max-w-md text-sm leading-5 sm:leading-7 text-left text-gray-500">
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

      <div className="flex flex-wrap items-end gap-8 mt-8">
        {variations.length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3 font-semibold">Weight</p>
            <div className="flex items-center gap-3 px-3 py-2 border border-gray-300 w-36">
              <button onClick={() => onWeightChange(-1)} disabled={weightIndex === 0} className="text-gray-400 transition-colors hover:text-gray-700 disabled:opacity-25">
                <LuChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <span ref={weightLabelRef} className="flex-1 text-sm font-medium text-center text-gray-700">
                {activeVariation?.variation?.split(": ")?.[1] ?? "\u2014"}
              </span>
              <button onClick={() => onWeightChange(1)} disabled={weightIndex === variations.length - 1} className="text-gray-400 transition-colors hover:text-gray-700 disabled:opacity-25">
                <LuChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}

        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3 font-semibold">Quantity</p>
          <div className="flex items-center border border-gray-300">
            <button onClick={() => onQuantityChange(-1)} className="px-3 py-2 text-lg leading-none text-gray-400 transition-colors hover:text-gray-700 hover:bg-gray-50">{"\u2212"}</button>
            <span ref={qtyRef} className="w-10 text-sm font-medium text-center text-gray-700 select-none">{quantity}</span>
            <button onClick={() => onQuantityChange(1)} className="px-3 py-2 text-lg leading-none text-gray-400 transition-colors hover:text-gray-700 hover:bg-gray-50">+</button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-8">
        <button ref={addCartBtnRef} onClick={onCartClick} className="flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-3.5 border border-gray-800 text-gray-800 text-xs tracking-widest uppercase font-semibold hover:bg-gray-800 hover:text-white transition-colors duration-300">
          <LuShoppingCart size={15} strokeWidth={1.5} />
          {hasAddedToCart ? "View Cart" : "Add to Cart"}
        </button>
        <button ref={shopBtnRef} onClick={onShopNow} className="flex w-full sm:w-auto justify-center items-center gap-2 px-8 py-3.5 bg-[#b5433a] text-white text-xs tracking-widest uppercase font-semibold hover:bg-[#9b3830] transition-colors duration-300">
          <LuShoppingBag size={15} strokeWidth={1.5} />
          Shop Now
        </button>
      </div>
    </div>
  );
}
