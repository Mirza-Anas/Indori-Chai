import HomePage from "../components/HomePage";
import Navbar from "../components/Navbar";
import AboutUs from "../components/AboutUs";
import ProductHome from "../components/ProductHome";
import Introduction from "../components/Introduction";
import Footer from "../components/Footer";
import WhyCooseUs from "../components/WhyCooseUs";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Premium Indian Tea Online",
  description:
    "Discover authentic Indori Chai blends made from quality tea leaves. Shop refreshing Indian tea for everyday chai moments, delivered across India.",
  path: "/",
});

export default function Home() {
  return (
    <div className="relative flex items-center justify-center min-h-screen font-sans text-slate-600">
      <main className="relative flex-row items-center justify-between w-full min-h-screen md:items-start md:justify-start bg-slate-50 sm:items-start">
        <HomePage />
        <AboutUs />
        <ProductHome />
        <WhyCooseUs />
        <Introduction />
      </main>
    </div>
  );
}
