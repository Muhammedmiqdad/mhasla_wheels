import { useState } from "react";
import { Button } from "@/components/ui/button";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    ride_date: "",
    pickup_location: "",
    drop_time: "",
    ride_type: "Private",
  });

  const [status, setStatus] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const res = await fetch("/.netlify/functions/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      setStatus(result.message || "Success!");

      // ✅ Save booking details locally
      localStorage.setItem("lastBooking", JSON.stringify(formData));

      // ✅ Redirect to Thank You page after success
      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 1000);
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto"
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        required
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        required
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="datetime-local"
        name="ride_date"
        required
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="pickup_location"
        placeholder="Pickup Location"
        required
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="drop_time"
        placeholder="Drop Time (optional)"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <select
        name="ride_type"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="Private">Private</option>
        <option value="Shared">Shared</option>
        <option value="One Way">One Way</option>
        <option value="Return">Return</option>
      </select>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" variant="book" className="w-full">
          Book Ride
        </Button>
        <Button
          type="button"
          variant="blue"
          className="w-full"
          onClick={() => (window.location.href = "/")}
        >
          Cancel
        </Button>
      </div>

      {status && <p className="text-center text-sm mt-2">{status}</p>}
    </form>
  );
};

export default BookingForm;
