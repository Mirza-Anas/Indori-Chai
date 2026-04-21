"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".about-title, .about-line, .about-leaves", {
        x: -50,
        autoAlpha: 0,
      });

      gsap.set(".about-text > *", {
        y: 40,
        autoAlpha: 0,
      });

      gsap.set(".about-image", {
        x: 50,
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      tl.to(".about-title", {
        x: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.set(".about-line", {
        scaleX: 0,
        transformOrigin: "left",
      });

      tl.to(".about-line", {
        scaleX: 1,
        autoAlpha: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      tl.to(
        ".about-leaves",
        {
          x: 0,
          autoAlpha: 0.8,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.6",
      );

      tl.to(
        ".about-text > *",
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.2,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.6",
      );

      tl.to(
        ".about-image",
        {
          x: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.8",
      );

      gsap.to(".about-leaves", {
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          scrub: true,
        },
      });

      gsap.to(".bg-box", {
        y: 40,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-16 overflow-hidden bg-white lg:py-28">
      <div className="px-6 mx-auto md:px-8 lg:px-0">
        {/* ── DESKTOP LAYOUT (lg+): unchanged 3-column grid ── */}
        <div className="items-center hidden grid-cols-1 gap-16 lg:grid lg:grid-cols-3">
          {/* Left Panel */}
          <div className="relative bg-white p-10 md:p-16 min-h-[500px] flex items-start">
            <div>
              <h2 className="font-serif text-2xl leading-tight text-gray-800 about-title md:text-2xl lg:text-4xl">
                Authentic <br /> Tea Experience
              </h2>
              <div className="about-line w-24 h-0.5 bg-orange-400 mt-6 origin-left"></div>
            </div>

            <img
              src="/leaves-bw.png"
              alt="Tea Leaves"
              className="absolute pointer-events-none about-leaves -bottom-12 left-20 w-96 opacity-80"
            />
          </div>

          {/* Middle Content */}
          <div className="space-y-6 text-gray-700 about-text">
            <h3 className="font-serif text-xl leading-relaxed md:text-2xl">
              Organically and ethically grown loose leaf tea, carefully blended to create the perfect cup.
            </h3>

            <p className="text-sm leading-relaxed text-gray-600 md:text-base">
              Over the years, as our reputation grew and our reach spread, it became equally obvious that people
              throughout the world shared this desire for a cup of tea that was much more than simply refreshment, but
              an enjoyable, memorable and satisfying experience.
            </p>

            <p className="text-sm leading-relaxed text-gray-600 md:text-base">
              Early in the life of our tea, our Managing Director promised, "I will not sell anything that I would not
              drink at home." This refusal to accept anything but the finest teas primarily in terms of flavour, aroma,
              strength and consistency continues to guide our tasters and inspire our entire company.
            </p>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="bg-box absolute -top-6 -right-6 w-full h-full bg-[#e9e9e6] -z-10"></div>
            <img
              src="/tea-stock-image.jpg"
              alt="Tea Cup"
              className="about-image w-full h-[500px] object-cover shadow-lg"
            />
          </div>
        </div>

        {/* ── MOBILE / TABLET LAYOUT (below lg): matches the attached image ── */}
        <div className="space-y-8 lg:hidden">
          {/* Row 1: Leaves illustration (left) + heading (right), side by side */}
          <div className="flex items-center gap-4">
            {/* Leaves illustration — positioned naturally, not absolute */}
            <div className="flex justify-center w-6/12 shrink-0">
              <img src="/leaves-bw.png" alt="Tea Leaves" className="about-leaves w-full max-w-[180px] opacity-80" />
            </div>

            {/* Heading + accent line */}
            <div className="flex-1">
              <h3 className="font-serif text-2xl leading-snug text-center text-gray-800 sm:text-2xl about-title">
                Authentic <br /> Tea Experience
              </h3>
              <div className="about-line w-16 h-0.5 bg-orange-400 mt-4 mx-auto origin-left"></div>
            </div>
          </div>

          {/* Row 2: First body paragraph — full width */}
          <div className="space-y-6 about-text">
            <h3 className="font-serif text-lg leading-relaxed text-justify md:text-2xl">
              Organically and ethically grown loose leaf tea, carefully blended to create the perfect cup.
            </h3>
            <p className="text-sm leading-relaxed text-justify text-gray-700">
              Over the years, as our reputation grew and our reach spread, it became equally obvious that people
              throughout the world shared this desire for a cup of tea that was much more than simply refreshment, but
              an enjoyable, memorable and satisfying experience.
            </p>
            <p className="flex-1 text-sm leading-relaxed text-justify text-gray-700">
              Early in the life of our tea, our Managing Director promised, "I will not sell anything that I would not
              drink at home. This refusal to accept anything but the finest teas primarily in terms of flavour, aroma, strength and
                consistency continues to guide our tasters and inspire our entire company."
            </p>

            {/* Row 3: Second paragraph (left) + image (right), side by side */}
            {/* <div className="flex items-start gap-4 sm:gap-6">
              <p className="flex-1 text-sm leading-relaxed text-justify text-gray-700">
                This refusal to accept anything but the finest teas primarily in terms of flavour, aroma, strength and
                consistency continues to guide our tasters and inspire our entire company.
              </p>

              <div className="relative shrink-0 w-[45%] sm:w-4/12">
                <div className="absolute w-full h-full rounded-lg bg-box -top-3 -right-3 -z-10"></div>
                <img
                  src="/tea-stock-image.jpg"
                  alt="Tea Cup"
                  className="object-cover w-full h-48 rounded-lg shadow-lg about-image sm:h-64"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
