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
  ride_date?: string;       // legacy field
  depart_date?: string;     // new fields
  depart_time?: string;
  return_date?: string;
  return_time?: string;
  journey_type?: string;
  ride_type?: string;       // legacy field
}

const ThankYou = () => {
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("lastBooking");
    if (saved) {
      setBooking(JSON.parse(saved));
      localStorage.removeItem("lastBooking"); // clear after use
    }
  }, []);

  // ✅ Helper: format booking date
  const formatBookingDate = (b: BookingData) => {
    if (b.depart_date) {
      const dt = new Date(
        `${b.depart_date}T${b.depart_time || "00:00"}:00`
      );
      return dt.toLocaleString();
    }
    if (b.ride_date) {
      return new Date(b.ride_date).toLocaleString();
    }
    return "N/A";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <CheckCircle className="text-green-500 mb-6" size={80} />
      <h1 className="text-3xl font-bold mb-4 text-center">Booking Confirmed!</h1>
      <p className="text-muted-foreground text-lg mb-8 text-center max-w-md">
        {booking ? (
          <>
            Thank you, <span className="font-semibold">{booking.name}</span>!{" "}
            Your{" "}
            <span className="font-semibold">
              {booking.journey_type || booking.ride_type || "ride"}
            </span>{" "}
            has been booked. We’ll pick you up from{" "}
            <span className="font-semibold">{booking.pickup_location}</span> on{" "}
            <span className="font-semibold">{formatBookingDate(booking)}</span>.
          </>
        ) : (
          <>
            Thank you for booking with{" "}
            <span className="font-semibold">Mhasla Wheels</span>. Our team will
            contact you shortly to confirm your ride details.
          </>
        )}
      </p>

      <div className="flex gap-4">
        <Button asChild className="btn-gradient text-primary-foreground">
          <Link to="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/fleet">View Our Fleet</Link>
        </Button>
      </div>
    </div>
  );
};

export default ThankYou;
