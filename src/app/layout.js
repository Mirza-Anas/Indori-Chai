import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/AppProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Indori Chai | Premium Indian Tea at Affordable Prices",
  description:
    "Buy Indori Chai online - premium Indian tea with a strong, authentic taste at an affordable price. Enjoy delicious, refreshing tea made for everyday chai lovers.",
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
