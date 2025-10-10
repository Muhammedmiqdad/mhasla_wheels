import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

type Vehicle = {
  id: string;
  name: string;
  type?: string;
  capacity?: number;
  per_km_rate?: number;
  base_rate?: number;
  image_url?: string;
  availability?: boolean;
};

export default function BookingForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    journey_type: "one_way",
    depart_date: "",
    depart_time: "",
    return_date: "",
    return_time: "",
    coupon_code: "",
    custom_journey_details: "",
    custom_rate: "",
    custom_unit: "",
    name: user?.user_metadata?.name || "",
    phone: user?.user_metadata?.phone || "",
    email: user?.email || "",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [status, setStatus] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVehicles() {
      setLoadingVehicles(true);
      try {
        const res = await fetch("/.netlify/functions/get-vehicles");
        const json = await res.json();
        if (json.ok) {
          setVehicles(json.vehicles || []);
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoadingVehicles(false);
      }
    }
    fetchVehicles();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setStatus("⚠️ Please log in to book a ride.");
      return;
    }

    setLoading(true);
    setStatus("Submitting...");

    try {
      const payload = {
        ...formData,
        pickup_location: formData.from,
        drop_location: formData.to,
        vehicle_id: selectedVehicle?.id || null,
        customer_id: user.id,
      };

      const res = await fetch("/.netlify/functions/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        setStatus(result?.message || "❌ Submission failed");
        setLoading(false);
        return;
      }

      setStatus("✅ " + (result.message || "Booking submitted successfully!"));
      localStorage.setItem("lastBooking", JSON.stringify(result.booking));

      setTimeout(() => {
        if (result.booking?.booking_code) {
          window.location.href = `/thank-you?code=${result.booking.booking_code}`;
        } else {
          window.location.href = "/thank-you";
        }
      }, 1200);
    } catch (err) {
      console.error(err);
      setStatus("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-[#0A0A0A] text-white shadow-xl rounded-2xl max-w-3xl mx-auto border border-gray-800"
    >
      {/* From & To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="from"
          value={formData.from}
          onChange={handleChange}
          placeholder="Pickup Location"
          required
          className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
        />
        <input
          name="to"
          value={formData.to}
          onChange={handleChange}
          placeholder="Drop Location"
          required
          className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
        />
      </div>

      {/* Journey Type */}
      <div className="flex gap-3 justify-center flex-wrap">
        {[
          { key: "one_way", label: "One Way" },
          { key: "round_trip", label: "Round Trip" },
          { key: "shared", label: "Shared / Seat" },
          { key: "customize", label: "Customize" },
        ].map((opt) => (
          <button
            type="button"
            key={opt.key}
            onClick={() =>
              setFormData((s) => ({ ...s, journey_type: opt.key }))
            }
            className={`px-4 py-2 rounded-lg border transition-all ${
              formData.journey_type === opt.key
                ? "bg-red-600 text-white border-red-600"
                : "bg-[#111] text-gray-300 border-gray-700 hover:bg-[#1A1A1A]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Custom Journey */}
      {formData.journey_type === "customize" && (
        <div className="space-y-3 mt-3">
          <textarea
            name="custom_journey_details"
            value={formData.custom_journey_details}
            onChange={handleChange}
            placeholder="Describe your custom journey (e.g., multiple stops, special requirements)"
            className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
            rows={3}
            required
          />
          <input
            type="number"
            name="custom_rate"
            value={formData.custom_rate}
            onChange={handleChange}
            placeholder="Enter custom rate (₹)"
            className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
            required
          />
          <select
            name="custom_unit"
            value={formData.custom_unit}
            onChange={handleChange}
            className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
            required
          >
            <option value="">Select Unit</option>
            <option value="km">Per Km</option>
            <option value="hour">Per Hour</option>
            <option value="day">Per Day</option>
            <option value="trip">Per Trip</option>
          </select>
        </div>
      )}

      {/* Vehicles */}
      <div>
        <h4 className="font-semibold mb-2 text-gray-300">Available Vehicles</h4>
        {loadingVehicles ? (
          <p className="text-sm text-gray-500">Loading vehicles...</p>
        ) : (
          <div className="space-y-3">
            {vehicles.filter((v) => v.availability !== false).length === 0 && (
              <p className="text-sm text-gray-500">No vehicles available.</p>
            )}
            {vehicles
              .filter((v) => v.availability !== false)
              .map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition border ${
                    selectedVehicle?.id === v.id
                      ? "bg-red-600/10 border-red-600"
                      : "bg-[#111] border-gray-700 hover:border-red-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {v.image_url ? (
                      <img
                        src={v.image_url}
                        alt={v.name}
                        className="w-10 h-10 object-contain rounded"
                      />
                    ) : (
                      <Car className="w-8 h-8 text-gray-500" />
                    )}
                    <div>
                      <div className="font-medium">{v.name}</div>
                      <div className="text-sm text-gray-500">
                        {v.type || ""}{" "}
                        {v.capacity ? `• ${v.capacity} seats` : ""}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-200">
                    {v.per_km_rate
                      ? `₹${v.per_km_rate}/km`
                      : v.base_rate
                      ? `₹${v.base_rate}`
                      : "-"}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Coupon */}
      <div className="flex gap-2 items-center">
        <input
          name="coupon_code"
          value={formData.coupon_code}
          onChange={handleChange}
          placeholder="Enter coupon code (optional)"
          className="flex-1 p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
        />
        <button
          type="button"
          className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-white font-medium"
        >
          Apply
        </button>
      </div>

      {/* Contact Info */}
      {!user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400"
            required
          />
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button
          type="submit"
          variant="primary"
          className="w-full sm:w-auto rounded-full"
          disabled={loading || !user}
        >
          {loading ? "Submitting..." : !user ? "Login to Book" : "Book Ride"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => (window.location.href = "/")}
          className="w-full sm:w-auto rounded-full"
        >
          Cancel
        </Button>
      </div>

      {/* Status */}
      {status && (
        <p className="text-center text-sm mt-2 text-gray-300">{status}</p>
      )}

      {!user && (
        <div className="mt-4 p-3 rounded-lg bg-red-600/10 border border-red-600 flex items-center gap-2 text-sm text-gray-200">
          🔒 You can explore vehicles, but{" "}
          <Link to="/login" className="text-red-400 underline font-medium">
            login
          </Link>{" "}
          to complete your booking.
        </div>
      )}
    </form>
  );
}
