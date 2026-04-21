import HomePage from "../components/HomePage";
import Navbar from "../components/Navbar";
import AboutUs from "../components/AboutUs";
import ProductHome from "../components/ProductHome";
import Introduction from "../components/Introduction";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="relative flex items-center justify-center min-h-screen font-sans text-slate-600">
      <main className="relative flex-row items-center justify-between w-full min-h-screen md:items-start md:justify-start bg-slate-50 sm:items-start">
        <HomePage />
        <AboutUs />
        <ProductHome />
        <Introduction />
      </main>
    </div>
  );
}
