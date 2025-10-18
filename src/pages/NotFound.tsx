// src/pages/NotFound.tsx
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-[#181818] text-center border-b border-red-800/20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.2)]">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Oops! The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>
      </section>

      {/* Content Card */}
      <section className="flex-grow py-16 bg-[#141414] border-b border-red-800/10">
        <div className="max-w-lg mx-auto px-6">
          <div className="bg-[#1f1f1f] border border-red-800/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,0,0,0.15)] text-center">
            <p className="text-gray-400 mb-8">
              The page <span className="text-red-500">{location.pathname}</span> was not found.  
              You can return to the homepage or go back to your previous page.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="w-full sm:w-auto py-3 px-6 rounded-full bg-red-600 hover:bg-red-700 text-white text-lg font-semibold transition">
                  <Home size={20} className="mr-2" /> Back to Home
                </Button>
              </Link>

              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full sm:w-auto py-3 px-6 rounded-full border border-red-800/40 hover:bg-red-600/20 text-gray-300 text-lg font-semibold transition"
              >
                <ArrowLeft size={20} className="mr-2" /> Go Back
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NotFound;
