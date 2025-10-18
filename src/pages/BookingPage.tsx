// src/pages/BookingPage.tsx
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import BookingModal from "@/components/BookingModal";
import { motion } from "framer-motion";

const BookingPage = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-white overflow-hidden">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-[#181818] text-center border-b border-red-800/20">
        <motion.div
          className="max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Book Your <span className="text-red-500">Ride</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Plan your perfect journey with Mhasla Wheels — from city rides to
            custom tours.
          </p>
        </motion.div>
      </section>

      {/* Booking Form Section */}
      <section className="flex-grow py-20 bg-[#141414] border-b border-red-800/10">
        <motion.div
          className="max-w-4xl mx-auto px-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.95 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <div className="bg-[#1a1a1a] border border-red-800/30 rounded-2xl p-6 md:p-10 shadow-[0_0_25px_rgba(255,0,0,0.15)] hover:shadow-[0_0_30px_rgba(255,0,0,0.25)] transition-all">
            <BookingForm />
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#181818] text-center border-t border-red-800/20">
        <motion.div
          className="max-w-3xl mx-auto px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Need a <span className="text-red-500">Custom Trip</span>?
          </h2>
          <p className="text-gray-400 mb-8">
            We can tailor your journey to match your exact travel needs and
            schedule. Just let us know!
          </p>
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-full text-white text-lg font-semibold transition-all"
          >
            Customize My Ride
          </button>
        </motion.div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default BookingPage;
