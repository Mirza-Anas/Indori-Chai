"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Introduction() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Initial states ──
      gsap.set(".intro-image", { scale: 1.00, autoAlpha: 0 });
      gsap.set(".intro-label-line", { scaleY: 0, transformOrigin: "top center" });
      gsap.set(".intro-label", { x: -20, autoAlpha: 0 });
      gsap.set(".intro-mobile-label", { y: -12, autoAlpha: 0 });
      gsap.set(".intro-mobile-line", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".intro-p1", { y: 36, autoAlpha: 0 });
      gsap.set(".intro-p2", { y: 36, autoAlpha: 0 });
      gsap.set(".intro-leaves", { x: -30, autoAlpha: 0 });

      // ── Main scroll-triggered timeline ──
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // Image fades in + unzooms
      tl.to(".intro-image", {
        scale: 1,
        autoAlpha: 1,
        duration: 1.3,
        ease: "power3.out",
      });

      // Vertical label line draws downward
      tl.to(".intro-label-line", {
        scaleY: 1,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.8");

      // "ABOUT US" text slides in
      tl.to(".intro-label", {
        x: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.3");

      // Mobile label fades down
      tl.to(".intro-mobile-label", {
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        ease: "power2.out",
      }, "<");

      // Mobile underline draws right
      tl.to(".intro-mobile-line", {
        scaleX: 1,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.2");

      // First paragraph rises in
      tl.to(".intro-p1", {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.3");

      // Second paragraph rises in
      tl.to(".intro-p2", {
        y: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.4");

      // Decorative leaves drifts in from left
      tl.to(".intro-leaves", {
        x: 0,
        autoAlpha: 0.5,
        duration: 1,
        ease: "power2.out",
      }, "-=0.8");

      // ── Parallax: leaves drift upward on scroll ──
      gsap.to(".intro-leaves", {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // ── Parallax: image subtle vertical shift ──
      gsap.to(".intro-image", {
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="AboutUs" ref={sectionRef} className="relative w-full pt-20 overflow-hidden bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

        {/* ── IMAGE: top on mobile/tablet ── */}
        <div className="relative h-[260px] sm:h-[340px] lg:hidden overflow-hidden">
          <img
            src="/introduction-tea.jpeg"
            alt="Tea Setup"
            className="object-cover w-full h-full intro-image"
          />
        </div>

        {/* ── LEFT SIDE ── */}
        <div className="relative flex items-center px-6 py-12 sm:px-10 md:px-16 lg:py-20">

          {/* Vertical label — sm+ only */}
          <div className="absolute flex-col items-center hidden left-4 sm:left-8 lg:left-12 top-8 sm:top-10 sm:flex">
            <div className="intro-label-line w-0.75 h-16 sm:h-24 bg-orange-300 mb-4" />
            <span className="intro-label text-xs sm:text-lg font-bold tracking-[0.3em] text-gray-600 rotate-180 [writing-mode:vertical-rl]">
              ABOUT US
            </span>
          </div>

          {/* Mobile label — mobile only */}
          <div className="absolute sm:hidden top-6">
            <p className="intro-mobile-label text-md font-bold tracking-[0.3em] text-gray-500 mb-2">
              ABOUT US
            </p>
            <div className="intro-mobile-line w-20 h-0.75 bg-orange-300" />
          </div>

          {/* Content */}
          <div className="w-full max-w-md mt-8 sm:ml-20 lg:ml-28 sm:mt-0">
            <p className="text-sm leading-relaxed text-gray-600 intro-p1 md:text-base">
              Tea is an infusion made by steeping processed leaves buds or twigs of the tea bush Camellia sinensis in
              hot water for several minutes. The processing can include oxidation heating drying and the addition of
              other herbs flowers spices and fruits. Tea is an infusion made by steeping processed leaves buds or twigs
              of the tea bush Camellia sinensis in hot water for several. For several minutes. The processing can
              include oxidation heating drying and the addition of other herbs flowers spices and fruits.
            </p>

            <p className="relative z-10 mt-6 text-sm leading-relaxed text-gray-600 intro-p2 md:text-base">
              The four basic type of true tea are black tea, oolong tea, green tea, and white tea. The term "herbal tea"
              usually refers to infusions or tisane of fruit or herbs that contain no Camellia sinensis. The four basic
              type of true tea are black tea, oolong tea, green tea, and white tea. The term "herbal tea" usually refers
              to infusions or tisane of fruit or herbs that contain no Camellia sinensis.
            </p>
          </div>

          {/* Decorative leaves */}
          <img
            src="/indroduction-leaves.png"
            alt="Tea Leaves Decoration"
            className="absolute bottom-0 left-0 z-0 opacity-50 pointer-events-none select-none intro-leaves w-60 sm:w-72 lg:w-92"
          />
        </div>

        {/* ── RIGHT IMAGE — desktop only ── */}
        <div className="relative h-[300px] lg:h-auto hidden lg:block overflow-hidden">
          <img
            src="/introduction-tea.jpeg"
            alt="Tea Setup"
            className="object-cover w-full h-full intro-image"
          />
        </div>

      </div>
    </section>
  );
}