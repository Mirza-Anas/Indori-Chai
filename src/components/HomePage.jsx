"use client";
import React, { useEffect, useRef } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import gsap from "gsap";

const socialLinks = [
  { Icon: FaFacebookF, href: "#" },
  { Icon: FaTwitter, href: "#" },
  { Icon: FaInstagram, href: "#" },
  { Icon: FaLinkedin, href: "#" },
];

const HomePage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-title, .hero-desc, .hero-btn, .social-icon", {
        autoAlpha: 0,
        y: 30,
      });
      gsap.set(".hero-btn", { scale: 0.9 });

      const tl = gsap.timeline();

      gsap.fromTo(".bg-image", { scale: 1.1 }, { scale: 1, duration: 2.2, ease: "power2.out" });

      tl.to(".hero-title", {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
      });

      tl.to(".hero-desc", {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }, "-=0.5");

      tl.to(".hero-btn", {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      }, "-=0.3");

      gsap.to(".social-icon", {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="HomePage"
      className="relative flex flex-col justify-between w-full h-[95vh] sm:h-screen overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-image"
        style={{ backgroundImage: `url("/home-bg.jpg")` }}
      />

      {/* Gradient overlay — stronger at bottom for social icons legibility */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/70" />

      {/* Main Content — vertically centered */}
      <div className="relative z-10 flex flex-col justify-center flex-1 px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="max-w-xl text-white lg:max-w-2xl">

          {/* Eyebrow label */}
          <p className="hero-desc mb-3 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-orange-300 font-medium">
            Premium Indian Tea
          </p>

          {/* Heading */}
          <h1 className="hero-title font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight">
            A Sublime<br />
            Infusion<br className="sm:hidden" />
            <span className="hidden sm:inline"> </span>
            Of Whole Tea
          </h1>

          {/* Accent line */}
          <div className="w-10 h-px mt-5 mb-5 bg-orange-400 hero-desc" />

          {/* Description */}
          <p className="max-w-sm text-sm leading-relaxed hero-desc sm:text-base md:text-lg text-white/80 sm:max-w-md">
            Made from the finest green teas, our range is exceptionally
            healthy and rejuvenating. Enjoy our selection for every mood
            and occasion.
          </p>

          {/* CTA Button */}
          <button className="hero-btn mt-8 px-8 py-3.5 text-sm sm:text-base font-medium tracking-widest uppercase text-white border border-white/70 hover:bg-white hover:text-black transition-all duration-300">
            Explore Collection
          </button>
        </div>
      </div>

      {/* Social Icons — pinned to bottom */}
      <div className="relative z-10 flex items-center gap-6 px-6 pb-8 sm:px-10 md:px-16 lg:px-24">
        {socialLinks.map(({ Icon, href }, i) => (
          <a
            key={i}
            href={href}
            className="transition-colors duration-300 social-icon text-white/70 hover:text-white"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </section>
  );
};

export default HomePage;