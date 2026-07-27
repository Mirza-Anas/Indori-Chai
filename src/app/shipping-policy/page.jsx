import Link from "next/link";
import { LuChevronLeft, LuTruck, LuMapPin, LuMail, LuClock, LuCircleAlert } from "react-icons/lu";

const highlights = [
  {
    icon: LuTruck,
    title: "Order Processing & Dispatch",
    body: "All orders placed on Indori Chai are processed within 1 business day after successful order confirmation and payment (where applicable). Orders placed on Sundays or public holidays will be processed on the next working business day.",
  },
  {
    icon: LuMapPin,
    title: "Delivery Across India",
    body: "Indori Chai, a brand owned and operated by Hindustan Consumer Products, currently delivers across India. Orders are shipped through trusted logistics partners including Delhivery, Shiprocket and Blue Dart, depending on service availability for your delivery location.",
  },
  {
    icon: LuClock,
    title: "Estimated Delivery Time",
    body: "Most orders are delivered within 3–7 business days from the date of dispatch. Delivery timelines are estimates and may vary depending on your location, courier operations, weather conditions or other unforeseen circumstances.",
  },
  {
    icon: LuMail,
    title: "Order Tracking",
    body: "Once your order has been dispatched, you will receive shipment confirmation along with the tracking details on your registered email address or mobile number, allowing you to track the status of your shipment.",
  },
  {
    icon: LuCircleAlert,
    title: "Shipping Charges",
    body: "Shipping charges, if applicable, are calculated and displayed during checkout before payment is completed. Shipping charges are non-refundable except where required under applicable law.",
  },
  {
  icon: LuCircleAlert,
  title: "Incorrect Delivery Address",
  body: "Customers are responsible for providing a complete and accurate delivery address while placing an order. If we identify an issue with the delivery address, we will make reasonable efforts to contact the customer before dispatch. Once an order has been dispatched, the delivery address cannot be changed."
}
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
          <h1 className="font-serif text-4xl sm:text-5xl text-gray-900 tracking-tight mb-4">Shipping Policy</h1>
          <p className="text-sm text-gray-400 tracking-wide">Last updated: June 2026</p>
        </div>

        <div className="border-t border-gray-200 mb-12" />

        {/* Intro */}
        <p className="text-sm leading-7 text-gray-600 mb-12">
          Indori Chai, a brand owned and operated by Hindustan Consumer Products, is committed to delivering premium tea
          products safely and efficiently across India. This Shipping Policy explains how we process, dispatch and
          deliver your orders placed through our website.
        </p>

        {/* Highlight cards */}
        <div className="space-y-0">
          {highlights.map((item, i) => (
            <div key={i} className="flex gap-5 py-8 border-b border-gray-200 last:border-0">
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
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#b5433a] font-semibold mb-3">Please Note</p>
          Orders are delivered through third-party courier partners. While we strive to ensure timely delivery, delays
          may occasionally occur due to factors beyond our reasonable control, including weather conditions, natural
          disasters, public holidays, transportation disruptions or courier network issues. If your shipment is delayed
          beyond the expected delivery period, please contact our support team and we will assist you in tracking your
          order.
        </div>

        {/* Contact */}
        <div className="mt-6 p-6 bg-white border border-gray-200">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#b5433a] font-semibold mb-3">Shipping Queries?</p>
          <p className="text-sm leading-7 text-gray-600">
            For any questions regarding shipping, order dispatch or delivery, please contact our support team.
            <br />
            <br />
            <strong>Business:</strong> Hindustan Consumer Products
            <br />
            <strong>Brand:</strong> Indori Chai
            <br />
            <strong>Email:</strong>{" "}
            <a href="mailto:indorichai@gmail.com" className="text-[#b5433a] hover:underline">
              indorichai@gmail.com
            </a>
            <br />
            <strong>Phone:</strong>{" "}
            <a href="tel:+918823019463" className="text-[#b5433a] hover:underline">
              +91 8823019463
            </a>
            <br />
            <strong>Business Hours:</strong> Monday – Friday, 9:00 AM – 6:00 PM
          </p>
        </div>
      </div>
    </div>
  );
}
