import Link from "next/link";
import { LuChevronLeft, LuCircleCheckBig } from "react-icons/lu";

const policies = [
  {
    title: "Order Cancellation",
    body: `Orders placed on Indori Chai may be cancelled only before they have been dispatched. Once an order has been packed and handed over to our courier partner for shipment, cancellation requests cannot be accepted.`,
  },
  {
    title: "Returns & Perishable Products",
    body: `Tea and other consumable products sold by Indori Chai, a brand owned and operated by Hindustan Consumer Products, are non-returnable due to their perishable nature. Returns are not accepted for reasons such as change of mind, incorrect product selection by the customer or personal taste preferences.`,
  },
  {
    title: "Damaged, Defective or Incorrect Products",
    body: `If you receive a damaged, defective, missing or incorrect product, please contact our customer support team within 24 hours of delivery. To help us investigate the issue, customers must provide clear photographs of the product, packaging and shipping label. After verification, we will provide an appropriate resolution, which may include a replacement or refund, depending on the circumstances.`,
  },
  {
    title: "Refund Eligibility",
    body: `Refunds are approved only for verified cases such as damaged products, defective products, incorrect items shipped, missing items or orders that cannot be fulfilled by us. Refund requests that do not meet these conditions may not be approved.`,
  },
  {
    title: "Refund Processing",
    body: `Once a refund request has been reviewed and approved, the refund will be processed within 5–7 business days. For prepaid orders, refunds will be made to the original payment method wherever possible. For Cash on Delivery (COD) orders, refunds will be processed through bank transfer or UPI after the required payment details have been provided by the customer.`,
  },
  {
  title: "Refund Approval",
  body: `All refund requests are reviewed by our customer support team before approval. We reserve the right to refuse refund requests where the claim cannot be verified or where the request does not comply with this Refund & Cancellation Policy.`
}
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
          <p className="text-sm text-gray-400 tracking-wide">Last updated: July 2026</p>
        </div>

        <div className="border-t border-gray-200 mb-12" />

        {/* Intro */}
        <p className="text-sm leading-7 text-gray-600 mb-12">
          This Refund &amp; Cancellation Policy explains the terms governing order cancellations, returns and refunds
          for products purchased from Indori Chai, a brand owned and operated by Hindustan Consumer Products. By placing
          an order on our website, you agree to the terms outlined in this policy.
        </p>

        {/* Policy cards */}
        <div className="space-y-0">
          {policies.map((policy, i) => (
            <div key={i} className="flex gap-5 py-8 border-b border-gray-200 last:border-0">
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
            For any questions regarding cancellations, returns or refunds, please contact our customer support team.
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
