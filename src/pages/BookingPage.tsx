// src/pages/Booking.tsx
import BookingForm from "@/components/BookingForm";

const BookingPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Book Your Ride</h1>
      <BookingForm />
    </div>
  );
};

export default BookingPage;
