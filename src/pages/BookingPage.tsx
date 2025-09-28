// src/pages/BookingPage.tsx
import BookingForm from "@/components/BookingForm";

const BookingPage = () => {
  return (
    <div id="booking-form" className="max-w-3xl mx-auto py-12 scroll-mt-24">
      <h1 className="text-3xl font-bold text-center mb-8">Book Your Ride</h1>
      <BookingForm />
    </div>
  );
};

export default BookingPage;
