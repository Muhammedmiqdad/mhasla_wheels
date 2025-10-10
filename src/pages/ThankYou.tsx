// src/pages/ThankYou.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-[#1a0000] text-white px-4 text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.2),transparent_70%)] blur-3xl" />

      {/* Success Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-3xl bg-red-600/30 rounded-full scale-150 animate-pulse" />
        <CheckCircle className="text-red-500 relative z-10" size={90} />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-white drop-shadow-md">
        Booking Confirmed!
      </h1>

      {/* Message */}
      <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
        {booking ? (
          <>
            Thank you,{" "}
            <span className="text-white font-semibold">
              {booking.name}
            </span>
            ! Your{" "}
            <span className="text-red-400 font-semibold">
              {booking.journey_type || booking.ride_type || "ride"}
            </span>{" "}
            has been booked. We’ll pick you up from{" "}
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
            <span className="text-red-500 font-semibold">Mhasla Wheels</span>.
            Our team will contact you shortly to confirm your ride details.
          </>
        )}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-3 text-lg transition-all shadow-lg"
        >
          <Link to="/">Back to Home</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-gray-600 text-gray-300 hover:text-white hover:border-red-500 rounded-full px-6 py-3 text-lg transition-all"
        >
          <Link to="/fleet">View Our Fleet</Link>
        </Button>
      </div>

      {/* Decorative Footer Text */}
      <p className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Mhasla Wheels — Drive in Luxury.
      </p>
    </div>
  );
};

export default ThankYou;
