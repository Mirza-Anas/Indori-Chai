"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import ProductGallery from "@/components/ProductGallery";
import ProductInfo from "@/components/ProductInfo";
import ProductReviews from "@/components/ProductReviews";

export default function ProductDetail() {
  const pathname = usePathname();
  const router = useRouter();
  const { addToCart } = useCart();
  const lastSegment = pathname.split("/").filter(Boolean).pop();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [weightIndex, setWeightIndex] = useState(0);
  const [product, setProduct] = useState({});
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const [images, setImages] = useState([]);
  const [variations, setVariations] = useState([]);

  const activeVariation = variations[weightIndex] ?? null;
  const displayPrice =
    activeVariation?.prices?.price?.slice(0, -2) * quantity ??
    product?.prices?.price?.slice(0, -2) * quantity ??
    null;

  const priceRef = useRef(null);
  const weightLabelRef = useRef(null);
  const imgRef = useRef(null);
  const addCartBtnRef = useRef(null);
  const shopBtnRef = useRef(null);
  const qtyRef = useRef(null);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_WOO_OPEN_URL}/products/${lastSegment}`
      );
      setProduct(data);
      setImages(data?.images ?? []);

      const variationIds = new Set((data?.variations ?? []).map((variation) => variation.id));
      const variationsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_WOO_OPEN_URL}/products?type=variation`
      );
      const filteredVariations = variationsResponse?.data
        .filter((variation) => variationIds.has(variation.id))
        .reverse();

      setVariations(filteredVariations ?? []);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    // Product loading synchronizes remote WooCommerce data into local page state.
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSegment]);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const changeWeight = (direction) => {
    const next = clamp(weightIndex + direction, 0, variations.length - 1);
    if (next === weightIndex) return;

    gsap.fromTo(
      priceRef.current,
      { y: direction > 0 ? 10 : -10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.35, ease: "power2.out" }
    );
    gsap.fromTo(
      weightLabelRef.current,
      { x: direction > 0 ? 12 : -12, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" }
    );
    setWeightIndex(next);
    setHasAddedToCart(false);
  };

  const changeImage = (direction) => {
    const next = clamp(activeImage + direction, 0, images.length - 1);
    if (next === activeImage) return;

    gsap.fromTo(
      imgRef.current,
      { x: direction > 0 ? 30 : -30, autoAlpha: 0.4 },
      { x: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" }
    );
    setActiveImage(next);
  };

  const changeQuantity = (delta) => {
    setQuantity((current) => clamp(current + delta, 1, 10));
    setHasAddedToCart(false);
    gsap.fromTo(qtyRef.current, { scale: 0.8 }, { scale: 1, duration: 0.2, ease: "back.out(2)" });
  };

  useEffect(() => {
    const buttons = [addCartBtnRef.current, shopBtnRef.current].filter(Boolean);
    const handlers = buttons.map((button) => {
      const enter = () => gsap.to(button, { scale: 1.03, duration: 0.2, ease: "power1.out" });
      const leave = () => gsap.to(button, { scale: 1, duration: 0.2, ease: "power1.out" });
      button.addEventListener("mouseenter", enter);
      button.addEventListener("mouseleave", leave);
      return { button, enter, leave };
    });

    return () => handlers.forEach(({ button, enter, leave }) => {
      button.removeEventListener("mouseenter", enter);
      button.removeEventListener("mouseleave", leave);
    });
  }, []);

  const updateCart = () => {
    addToCart({
      ...product,
      variation: activeVariation,
      weight: activeVariation?.weight,
      quantity,
    });
  };

  const handleCartClick = () => {
    if (hasAddedToCart) {
      router.push("/cart");
      return;
    }

    updateCart();
    setHasAddedToCart(true);
  };

  const handleShopNow = () => {
    updateCart();
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen pt-20 font-sans bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
        <ProductGallery
          product={product}
          images={images}
          activeImage={activeImage}
          imgRef={imgRef}
          onImageChange={changeImage}
          onSelectImage={setActiveImage}
        />
        <ProductInfo
          product={product}
          activeVariation={activeVariation}
          variations={variations}
          weightIndex={weightIndex}
          quantity={quantity}
          displayPrice={displayPrice}
          priceRef={priceRef}
          weightLabelRef={weightLabelRef}
          qtyRef={qtyRef}
          addCartBtnRef={addCartBtnRef}
          shopBtnRef={shopBtnRef}
          hasAddedToCart={hasAddedToCart}
          onWeightChange={changeWeight}
          onQuantityChange={changeQuantity}
          onCartClick={handleCartClick}
          onShopNow={handleShopNow}
        />
      </div>
      <ProductReviews product={product} />
    </div>
  );
}
