import Link from "next/link";
import { LuChevronLeft } from "react-icons/lu";

const sections = [
  {
    heading: "Introduction",
    body: `This Privacy Policy describes how Hindustan Consumer Products ("we", "our", "us"), operating under the brand name "Indori Chai", collects, uses, stores and protects your personal information when you visit or make a purchase through our website https://indorichai.in ("Platform"). By accessing or using our Platform, you agree to the terms of this Privacy Policy. Our products and services are intended only for customers within India, and your personal information is processed and stored in India in accordance with applicable Indian laws.`,
  },
  {
    heading: "Information We Collect",
    body: `When you create an account, place an order or contact us, we may collect information including your name, email address, mobile number, delivery address and any information you voluntarily provide while communicating with us. We may also collect information related to your orders, payment status and interactions with our customer support. We do not collect sensitive personal information such as Aadhaar number, PAN number or date of birth through our Platform.`,
  },
  {
    heading: "How We Use Your Information",
    body: `Your information is used to process and deliver your orders, manage your account, provide customer support, send order updates, respond to enquiries, improve our products and services, prevent fraudulent activities and comply with applicable legal obligations. With your consent, we may also send promotional emails, SMS or other marketing communications regarding our products and offers. You may opt out of such marketing communications at any time.`,
  },
  {
    heading: "Sharing of Information",
    body: `We do not sell or rent your personal information. We may share your information only with trusted third-party service providers such as payment gateway providers, courier and logistics partners, hosting providers and other vendors who assist us in operating our business. Information may also be disclosed when required by applicable law, legal process or government authorities.`,
  },
  {
    heading: "Security",
    body: `We implement reasonable technical and organisational security measures to protect your personal information against unauthorised access, disclosure, alteration or destruction. Although we strive to protect your information, no method of electronic transmission or storage is completely secure and we cannot guarantee absolute security.`,
  },
  {
    heading: "Data Retention and Account Deletion",
    body: `You may delete your account through your account settings or contact us using the details provided below. We may retain certain information where required by law, for accounting purposes, to resolve disputes, prevent fraud or fulfil pending orders. Information that is no longer required will be securely deleted or anonymised.`,
  },
  {
    heading: "Your Rights",
    body: `You may access, review, update or request correction of your personal information through your account or by contacting us. You may also request deletion of your personal information, subject to applicable legal and business requirements.`,
  },
  {
    heading: "Marketing Communications",
    body: `If you subscribe to our promotional communications, we may send you updates about new products, special offers and other marketing messages through email, SMS or other communication channels. You may unsubscribe from these communications at any time by following the instructions included in the communication or by contacting us.`,
  },
  {
    heading: "Changes to this Privacy Policy",
    body: `We may update this Privacy Policy from time to time to reflect changes in our business, legal requirements or services. The latest version will always be available on this page along with the revised effective date.`,
  },
  {
    heading: "Contact / Grievance Officer",
    isContact: true,
    contact: [
      { label: "Business", value: "Hindustan Consumer Products" },
      { label: "Brand", value: "Indori Chai" },
      { label: "Address", value: "47, Silver Colony, Indore, Madhya Pradesh - 452016, India" },
      { label: "Email", value: "indorichai@gmail.com" },
      { label: "Phone", value: "+91 8823019463" },
      { label: "Hours", value: "Monday – Friday, 9:00 AM – 6:00 PM" },
    ],
  },
];

export default function PrivacyPolicy() {
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
          <h1 className="font-serif text-4xl sm:text-5xl text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-400 tracking-wide">Last updated: July 2026</p>
        </div>

        <div className="border-t border-gray-200 mb-12" />

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="pb-10 border-b border-gray-100 last:border-0 last:pb-0">
              <h2 className="font-serif text-xl text-gray-800 mb-4">{section.heading}</h2>

              {section.body && <p className="text-sm leading-7 text-gray-600">{section.body}</p>}

              {section.isContact && (
                <div className="mt-4 space-y-3">
                  {section.contact.map((row, j) => (
                    <div key={j} className="flex gap-4">
                      <span className="shrink-0 text-[10px] tracking-[0.15em] uppercase text-gray-400 w-20 pt-0.5">
                        {row.label}
                      </span>
                      <span className="text-sm text-gray-700">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
