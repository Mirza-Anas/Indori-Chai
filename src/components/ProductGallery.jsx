"use client";

import Link from "next/link";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function ProductGallery({
  product,
  images,
  activeImage,
  imgRef,
  onImageChange,
  onSelectImage,
}) {
  return (
    <div className="relative flex items-start justify-center bg-gray-50 min-h-[360px] sm:min-h-[460px] lg:min-h-0">
      <div className="absolute top-0 left-0 z-10 px-6 pt-6 md:px-10">
        <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold tracking-widest text-gray-800 uppercase transition-colors duration-200 hover:text-gray-1000">
          <LuChevronLeft size={16} strokeWidth={2} />
          Back
        </Link>
      </div>

      {images.length > 1 && (
        <button onClick={() => onImageChange(-1)} disabled={activeImage === 0} className="absolute z-10 p-2 text-gray-400 transition-colors left-4 hover:text-gray-700 disabled:opacity-20">
          <LuChevronLeft size={22} strokeWidth={1.5} />
        </button>
      )}

      <div className="flex items-center justify-center w-full z-0 min-h-[50vh] sm:h-[calc(100vh-70px)] overflow-hidden">
        {images[activeImage] ? (
          <img ref={imgRef} src={images[activeImage].src} alt={product?.name} className="z-0 object-contain w-full select-none drop-shadow-lg" />
        ) : (
          <div className="w-64 h-64 bg-gray-200 rounded-full animate-pulse" />
        )}
      </div>

      {images.length > 1 && (
        <button onClick={() => onImageChange(1)} disabled={activeImage === images.length - 1} className="absolute z-10 p-2 text-gray-400 transition-colors right-4 hover:text-gray-700 disabled:opacity-20">
          <LuChevronRight size={22} strokeWidth={1.5} />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute flex gap-2 bottom-5">
          {images.map((_, index) => (
            <button key={index} onClick={() => onSelectImage(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeImage ? "bg-[#b5433a] scale-125" : "bg-gray-300"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
