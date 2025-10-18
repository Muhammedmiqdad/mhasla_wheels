// src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface BookingData {
  name: string;
  phone: string;
  email: string;
  pickup_location: string;
  drop_location?: string;
  ride_date?: string;
  depart_date?: string;
  depart_time?: string;
  return_date?: string;
  return_time?: string;
  journey_type?: string;
  ride_type?: string;
}

const ThankYou = () => {
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastBooking");
    if (saved) {
      setBooking(JSON.parse(saved));
      localStorage.removeItem("lastBooking");
    }
  }, []);

  const formatBookingDate = (b: BookingData) => {
    if (b.depart_date) {
      const dt = new Date(`${b.depart_date}T${b.depart_time || "00:00"}:00`);
      return dt.toLocaleString();
    }
    if (b.ride_date) {
      return new Date(b.ride_date).toLocaleString();
    }
    return "N/A";
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-[#181818] text-center border-b border-red-800/20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <div className="bg-red-600/20 border border-red-800/40 rounded-full p-6 shadow-[0_0_25px_rgba(255,0,0,0.2)]">
              <CheckCircle className="text-red-500" size={70} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
            Booking Confirmed!
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {booking ? (
              <>
                Thank you,{" "}
                <span className="text-white font-semibold">
                  {booking.name}
                </span>
                ! Your{" "}
                <span className="text-red-500 font-semibold">
                  {booking.journey_type || booking.ride_type || "ride"}
                </span>{" "}
                has been successfully booked. We'll pick you up from{" "}
                <span className="text-white font-semibold">
                  {booking.pickup_location}
                </span>{" "}
                on{" "}
                <span className="text-white font-semibold">
                  {formatBookingDate(booking)}
                </span>
                .
              </>
            ) : (
              <>
                Thank you for booking with{" "}
                <span className="text-red-500 font-semibold">
                  Mhasla Wheels
                </span>
                . Our team will contact you soon to confirm your trip details.
              </>
            )}
          </p>
        </div>
      </section>

      {/* Thank You Card Section */}
      <section className="flex-grow py-16 bg-[#141414] border-b border-red-800/10">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-[#1f1f1f] border border-red-800/30 rounded-2xl p-8 text-center shadow-[0_0_25px_rgba(255,0,0,0.15)]">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Your Booking Details
            </h2>
            {booking ? (
              <div className="text-gray-400 text-sm space-y-2 mb-6">
                <p>
                  <strong className="text-white">Pickup:</strong>{" "}
                  {booking.pickup_location}
                </p>
                {booking.drop_location && (
                  <p>
                    <strong className="text-white">Drop:</strong>{" "}
                    {booking.drop_location}
                  </p>
                )}
                <p>
                  <strong className="text-white">Date:</strong>{" "}
                  {formatBookingDate(booking)}
                </p>
                {booking.journey_type && (
                  <p>
                    <strong className="text-white">Journey Type:</strong>{" "}
                    {booking.journey_type}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-400 mb-6">
                We’ve received your booking and will confirm shortly.
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="w-full sm:w-auto py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-lg font-semibold transition"
              >
                <Link to="/">Back to Home</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto py-3 rounded-full border border-red-800/40 hover:bg-red-600/20 text-gray-300 text-lg font-semibold transition"
              >
                <Link to="/fleet">View Our Fleet</Link>
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

export default ThankYou;
