import Link from "next/link";
import { LuChevronLeft, LuTruck, LuMapPin, LuMail, LuClock, LuCircleAlert } from "react-icons/lu";

const highlights = [
  {
    icon: LuTruck,
    title: "Registered Courier Only",
    body: "All orders are shipped exclusively through registered domestic courier companies and/or speed post to ensure reliable and trackable delivery.",
  },
  {
    icon: LuClock,
    title: "Dispatch Within 7 Days",
    body: "Orders are dispatched within 7 days from the date of order and/or payment, or as per the delivery date confirmed at the time of order placement, subject to courier norms.",
  },
  {
    icon: LuMapPin,
    title: "Delivery to Your Address",
    body: "All orders are delivered to the address provided by the buyer at the time of purchase. Please ensure your delivery address is accurate and complete before confirming your order.",
  },
  {
    icon: LuMail,
    title: "Email Confirmation",
    body: "Delivery of our services will be confirmed on your registered email ID as specified at the time of registration. Keep an eye on your inbox for dispatch and delivery updates.",
  },
  {
    icon: LuCircleAlert,
    title: "Shipping Costs",
    body: "If there are any shipping costs levied by the Platform Owner, the same are non-refundable. Please review shipping charges at checkout before placing your order.",
  },
];

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-[#faf9f6] pt-12">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12 sm:py-16">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase text-gray-400 hover:text-gray-600 transition-colors mb-10"
        >
          <LuChevronLeft size={13} strokeWidth={1.5} />
          Back
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-4 h-px bg-[#b5433a]" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#b5433a] font-semibold">Legal</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-gray-900 tracking-tight mb-4">
            Shipping Policy
          </h1>
          <p className="text-sm text-gray-400 tracking-wide">Last updated: June 2025</p>
        </div>

        <div className="border-t border-gray-200 mb-12" />

        {/* Intro */}
        <p className="text-sm leading-7 text-gray-600 mb-12">
          At Indori Chai, we are committed to delivering your favourite teas swiftly and safely. Please read our shipping policy carefully to understand how we handle the delivery of your orders.
        </p>

        {/* Highlight cards */}
        <div className="space-y-0">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="flex gap-5 py-8 border-b border-gray-200 last:border-0"
            >
              {/* Icon badge */}
              <div className="shrink-0 mt-0.5 w-9 h-9 flex items-center justify-center bg-[#fdf3f2] border border-[#e8c5c0]">
                <item.icon size={17} className="text-[#b5433a]" strokeWidth={1.5} />
              </div>

              {/* Text */}
              <div>
                <h2 className="font-serif text-lg text-gray-800 mb-2">{item.title}</h2>
                <p className="text-sm leading-7 text-gray-600">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Liability note */}
        <div className="mt-12 p-6 bg-white border border-gray-200">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#b5433a] font-semibold mb-3">
            Please Note
          </p>
          <p className="text-sm leading-7 text-gray-600">
            The Platform Owner shall not be liable for any delay in delivery caused by the courier company or postal authority. Delivery timelines are estimates and may vary based on courier operations and your delivery location.
          </p>
        </div>

        {/* Contact */}
        <div className="mt-6 p-6 bg-white border border-gray-200">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#b5433a] font-semibold mb-3">
            Shipping Queries?
          </p>
          <p className="text-sm leading-7 text-gray-600">
            For any shipping-related queries, reach out to us at{" "}
            <a href="mailto:indorichai@gmail.com" className="text-[#b5433a] hover:underline">
              indorichai@gmail.com
            </a>{" "}
            or call{" "}
            <a href="tel:8823019463" className="text-[#b5433a] hover:underline">
              8823019463
            </a>
            {" "}between Monday – Friday, 9:00 AM – 6:00 PM.
          </p>
        </div>

      </div>
    </div>
  );
}
