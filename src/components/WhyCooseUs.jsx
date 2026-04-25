import Link from "next/link";
import { LuLeaf, LuAward, LuTruck, LuShieldCheck } from "react-icons/lu";

// ── Feature icon ──────────────────────────────────────────────────────────────
function FeatureIcon({ Icon }) {
  return (
    <div className="shrink-0 w-11 h-11 flex items-center justify-center bg-[#fdf3f2] border border-[#e8c5c0]">
      <Icon size={20} className="text-[#b5433a]" strokeWidth={1.5} />
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, body }) {
  return (
    <div className="py-7">
      <div className="flex items-start gap-4">
        <FeatureIcon Icon={Icon} />
        <div>
          <h3 className="font-serif text-[15px] text-gray-800 mb-1.5 leading-snug">{title}</h3>
          <p className="text-sm leading-relaxed text-gray-500">{body}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function WhyChooseUs() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6 sm:px-0 lg:px-0">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-16 xl:gap-24">

          {/* ══ LEFT ══════════════════════════════════════════════════════ */}
          <div className="lg:w-[36%] shrink-0 mb-14 lg:mb-0 lg:pt-7 flex flex-col justify-start">

            {/* Eyebrow */}
            <p className="inline-flex items-center gap-2.5 text-[12px] tracking-[0.25em] uppercase text-[#b5433a] font-semibold mb-5">
              <span className="w-4 h-px bg-[#b5433a] inline-block" />
              Why Indori Chai?
            </p>

            {/* Headline — large serif matching the reference weight */}
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-5xl xl:text-5xl text-gray-900 leading-[1.05] tracking-tight mb-7">
              The Indori<br />Difference
            </h2>

            {/* Body copy */}
            <p className="text-sm leading-7 text-gray-500 mb-9 max-w-xs">
              For over a decade, we've been a proud part of homes across
              Indore and beyond—earning trust one cup at a time with teas
              that are fresh, authentic, and always exceptional.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-7 text-sm font-semibold">
              <Link
                href="/products"
                className="group inline-flex items-center gap-1 text-gray-800 hover:text-[#b5433a] transition-colors duration-200"
              >
                Shop Now
                <span className="ml-0.5 group-hover:translate-x-0.5 transition-transform duration-200 inline-block">›</span>
              </Link>
              <Link
                href="/#AboutUs"
                className="group inline-flex items-center gap-1 text-gray-800 hover:text-[#b5433a] transition-colors duration-200"
              >
                Our Story
                <span className="ml-0.5 group-hover:translate-x-0.5 transition-transform duration-200 inline-block">›</span>
              </Link>
            </div>
          </div>

          {/* ══ RIGHT: imbalanced 2-col grid ═══════════════════════════════
              Reference layout:
                Col 1 row 1: Farm-Fresh Quality   (NO top border — flush with top)
                ──────── divider ────────
                Col 1 row 2: Certified Experts
                                                   ──── top border offset ────
                Col 2 row 1: Easy Financing        (HAS top border — pushed down)
                ──────── divider ────────
                Col 2 row 2: 100% Satisfaction
          ═══════════════════════════════════════════════════════════════════ */}
          <div className="flex-1 sm:mt-16 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2">

              {/* ── Column 1 — flush top ── */}
              <div className="sm:pr-10 sm:mt-14 sm:border-r sm:border-gray-200">
                {/* Card 1 — no top border */}
                <FeatureCard
                  icon={LuLeaf}
                  title="Farm-Fresh Quality"
                  body="Every batch is sourced directly from hand-picked tea gardens—so what reaches your cup is always fresh, pure, and full of flavour."
                />
                {/* Divider */}
                <div className="border-t border-gray-200" />
                {/* Card 2 */}
                <FeatureCard
                  icon={LuTruck}
                  title="Swift Delivery"
                  body="From our garden to your doorstep in 3–5 business days. We ship pan-India so your favourite chai is never far away."
                />
              </div>

              {/* ── Column 2 — intentionally offset with a top border ── */}
              {/*
                On mobile: a full-width top border separates from col 1.
                On sm+: the top border applies only inside this col,
                creating the visual "push down" effect seen in the reference.
              */}
              <div className="border-t border-gray-200 sm:pl-10 sm:border-t-16 sm:border-t-white relative">
                {/* The sm:border-t-[16px] sm:border-t-white trick creates
                    a transparent gap at the top of col 2, making the first
                    card appear to start lower than col 1's first card —
                    exactly the imbalance visible in the reference image. */}
                <div className="">
                  <FeatureCard
                    icon={LuAward}
                    title="Certified Excellence"
                    body="Our blends are FSSAI-certified and crafted under strict quality standards—because you deserve nothing but the finest."
                  />
                </div>
                {/* Divider */}
                <div className="border-t border-gray-200" />
                {/* Card 4 */}
                <FeatureCard
                  icon={LuShieldCheck}
                  title="100% Satisfaction"
                  body="Thousands of happy customers across Madhya Pradesh trust Indori Chai every single day—and we intend to keep it that way."
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}