import Link from "next/link";
import { LuChevronLeft } from "react-icons/lu";

const sections = [
  {
    heading: "Introduction",
    body: `This Privacy Policy describes how Indori Chai and its affiliates (collectively "Indori Chai, we, our, us") collect, use, share, protect or otherwise process your information / personal data through our website https://indorichai.in (hereinafter referred to as Platform). Please note that you may be able to browse certain sections of the Platform without registering with us. We do not offer any product/service under this Platform outside India and your personal data will primarily be stored and processed in India. By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.`,
  },
  {
    heading: "Collection",
    body: `We collect your personal data when you use our Platform, services or otherwise interact with us during the course of our relationship and related information may include your name, date of birth, address, telephone/mobile number, email ID, and/or any such information shared as proof of identity or address. Where possible, we indicate the mandatory and optional fields. You always have the option to not provide data by choosing not to use a particular service or feature on the Platform.`,
  },
  {
    heading: "Usage",
    body: `We use personal data to provide the services you request. To the extent we use your personal data to market to you, we will provide you the ability to opt-out of such uses. We use your personal data to assist sellers and business partners in handling and fulfilling orders; enhancing customer experience; to resolve disputes; troubleshoot problems; inform you about online and offline offers, products, services, and updates; customise your experience; detect and protect us against error, fraud and other criminal activity; enforce our terms and conditions; conduct marketing research, analysis and surveys; and as otherwise described to you at the time of collection of information. You understand that your access to these products/services may be affected in the event permission is not provided to us.`,
  },
  {
    heading: "Sharing",
    body: `We may share your personal data internally within our group entities, our other corporate entities, and affiliates to provide you access to the services and products offered by them. These entities and affiliates may market to you as a result of such sharing unless you explicitly opt-out. We may disclose personal data to third parties such as sellers, business partners, third party service providers including logistics partners, prepaid payment instrument issuers, third-party reward programs and other payment opted by you. These disclosure may be required for us to provide you access to our services and products offered to you, to comply with our legal obligations, to enforce our user agreement, to facilitate our marketing and advertising activities, to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our services. We may disclose personal and sensitive personal data to government agencies or other authorised law enforcement agencies if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal process.`,
  },
  {
    heading: "Security Precautions",
    body: `To protect your personal data from unauthorised access or disclosure, loss or misuse we adopt reasonable security practices and procedures. Once your information is in our possession or whenever you access your account information, we adhere to our security guidelines to protect it against unauthorised access and offer the use of a secure server. However, the transmission of information is not completely secure for reasons beyond our control. By using the Platform, the users accept the security implications of data transmission over the internet and the World Wide Web which cannot always be guaranteed as completely secure, and therefore, there would always remain certain inherent risks regarding use of the Platform. Users are responsible for ensuring the protection of login and password records for their account.`,
  },
  {
    heading: "Data Deletion and Retention",
    body: `You have an option to delete your account by visiting your profile and settings on our Platform; this action would result in you losing all information related to your account. You may also write to us at the contact information provided below to assist you with these requests. We may in event of any pending grievance, claims, pending shipments or any other services we may refuse or delay deletion of the account. Once the account is deleted, you will lose access to the account. We retain your personal data information for a period no longer than is required for the purpose for which it was collected or as required under any applicable law. However, we may retain data related to you if we believe it may be necessary to prevent fraud or future abuse or for other legitimate purposes. We may continue to retain your data in anonymised form for analytical and research purposes.`,
  },
  {
    heading: "Your Rights",
    body: `You may access, rectify, and update your personal data directly through the functionalities provided on the Platform.`,
  },
  {
    heading: "Consent",
    body: `By visiting our Platform or by providing your information, you consent to the collection, use, storage, disclosure and otherwise processing of your information on the Platform in accordance with this Privacy Policy. If you disclose to us any personal data relating to other people, you represent that you have the authority to do so and permit us to use the information in accordance with this Privacy Policy. You have an option to withdraw your consent that you have already provided by writing to the Grievance Officer at the contact information provided below. Please mention "Withdrawal of consent for processing personal data" in your subject line of your communication. Please note that your withdrawal of consent will not be retrospective and will be in accordance with the Terms of Use, this Privacy Policy, and applicable laws. In the event you withdraw consent given to us under this Privacy Policy, we reserve the right to restrict or deny the provision of our services for which we consider such information to be necessary.`,
  },
  {
    heading: "Changes to this Privacy Policy",
    body: `Please check our Privacy Policy periodically for changes. We may update this Privacy Policy to reflect changes to our information practices. We may alert / notify you about the significant changes to the Privacy Policy, in the manner as may be required under applicable laws.`,
  },
  {
    heading: "Grievance Officer",
    isContact: true,
    contact: [
      { label: "Designation", value: "Grievance Officer" },
      { label: "Company", value: "Indori Chai, 47, Silver Colony, Indore, Madhya Pradesh" },
      { label: "Email", value: "indorichai@gmail.com" },
      { label: "Phone", value: "8823019463" },
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
          <h1 className="font-serif text-4xl sm:text-5xl text-gray-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400 tracking-wide">Last updated: June 2025</p>
        </div>

        <div className="border-t border-gray-200 mb-12" />

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="pb-10 border-b border-gray-100 last:border-0 last:pb-0">
              <h2 className="font-serif text-xl text-gray-800 mb-4">{section.heading}</h2>

              {section.body && (
                <p className="text-sm leading-7 text-gray-600">{section.body}</p>
              )}

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
