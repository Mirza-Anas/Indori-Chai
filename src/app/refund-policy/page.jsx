import Link from "next/link";
import { LuChevronLeft, LuCircleCheckBig } from "react-icons/lu";

const policies = [
  {
    title: "Cancellation Window",
    body: `Cancellations will only be considered if the request is made within 3 days of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to the seller / merchant and they have initiated the process of shipping, or the product is already out for delivery. In such an event, you may choose to reject the product at the doorstep.`,
  },
  {
    title: "Perishable Items",
    body: `Indori Chai does not accept cancellation requests for perishable items like eatables. However, a refund or replacement can be made if the customer establishes that the quality of the product delivered is not satisfactory.`,
  },
  {
    title: "Damaged or Defective Items",
    body: `In case of receipt of damaged or defective items, please report to our customer service team within 3 days of receipt of the product. The request will be entertained once the seller / merchant has checked and determined the issue. If you feel the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 3 days of receiving the product. Our team will look into your complaint and take an appropriate decision.`,
  },
  {
    title: "Warranty Claims",
    body: `In case of complaints regarding products that come with a warranty from the manufacturers, please refer the issue directly to them.`,
  },
  {
    title: "Refund Processing Time",
    body: `In case of any refunds approved by Indori Chai, the refund will be processed within 3 business days to your original payment method.`,
  },
];

export default function RefundPolicy() {
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
            Refund &amp; Cancellation Policy
          </h1>
          <p className="text-sm text-gray-400 tracking-wide">Last updated: June 2025</p>
        </div>

        <div className="border-t border-gray-200 mb-12" />

        {/* Intro */}
        <p className="text-sm leading-7 text-gray-600 mb-12">
          This refund and cancellation policy outlines how you can cancel or seek a refund for a product or service that you have purchased through the Platform. Please read the following terms carefully.
        </p>

        {/* Policy cards */}
        <div className="space-y-0">
          {policies.map((policy, i) => (
            <div
              key={i}
              className="flex gap-5 py-8 border-b border-gray-200 last:border-0"
            >
              {/* Icon */}
              <div className="shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-sm bg-[#fdf3f2] border border-[#e8c5c0]">
                <LuCircleCheckBig size={16} className="text-[#b5433a]" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div>
                <h2 className="font-serif text-lg text-gray-800 mb-2">{policy.title}</h2>
                <p className="text-sm leading-7 text-gray-600">{policy.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact note */}
        <div className="mt-12 p-6 bg-white border border-gray-200">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#b5433a] font-semibold mb-2">Need Help?</p>
          <p className="text-sm leading-7 text-gray-600">
            For any refund or cancellation queries, please contact our customer service team at{" "}
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
