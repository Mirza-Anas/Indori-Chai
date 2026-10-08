import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/AppProvider";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Indori Chai | Premium Indian Tea at Affordable Prices",
    template: "%s | Indori Chai",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  verification: {
    google: "Ip3GwlrfZWEwm-Oh66t_n4up-vD3k1uA4n4CbJ9n8SM",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_NAME,
    title: "Indori Chai | Premium Indian Tea at Affordable Prices",
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Indori Chai | Premium Indian Tea at Affordable Prices",
    description: DEFAULT_DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <Navbar />
          <Toaster />
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
