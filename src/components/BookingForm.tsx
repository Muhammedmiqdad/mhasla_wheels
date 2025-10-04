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
  availability?: boolean; // ✅ include availability
};

export default function BookingForm() {
  const { user } = useAuth(); // ✅ get logged-in user
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    journey_type: "one_way",
    depart_date: "",
    depart_time: "",
    return_date: "",
    return_time: "",
    coupon_code: "",
    custom_journey_details: "", // ✅ NEW FIELD
    custom_rate: "", // ✅ NEW FIELD
    custom_unit: "", // ✅ NEW FIELD
    name: user?.user_metadata?.name || "",
    phone: user?.user_metadata?.phone || "",
    email: user?.email || "",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  const [status, setStatus] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch vehicles
  useEffect(() => {
    async function fetchVehicles() {
      setLoadingVehicles(true);
      try {
        const res = await fetch("/.netlify/functions/get-vehicles");
        const json = await res.json();
        if (json.ok) {
          setVehicles(json.vehicles || []);
        } else {
          console.error("Vehicle fetch failed:", json.message);
        }
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      } finally {
        setLoadingVehicles(false);
      }
    }
    fetchVehicles();
  }, []);

  // ✅ Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // ✅ Submit booking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 Require login
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
        customer_id: user.id, // ✅ link booking to user
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

      // ✅ Save last booking locally (backup)
      localStorage.setItem("lastBooking", JSON.stringify(result.booking));

      // ✅ Redirect to Thank You page with booking_code
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
      className="space-y-6 p-6 bg-white shadow-xl rounded-xl max-w-3xl mx-auto"
    >
      {/* From & To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="relative">
          <input
            name="from"
            value={formData.from}
            onChange={handleChange}
            placeholder=" "
            required
            className="peer w-full p-3 border rounded"
          />
          <span className="absolute left-3 top-1 text-sm text-gray-500 peer-placeholder-shown:top-3 transition-all">
            From
          </span>
        </label>

        <label className="relative">
          <input
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder=" "
            required
            className="peer w-full p-3 border rounded"
          />
          <span className="absolute left-3 top-1 text-sm text-gray-500 peer-placeholder-shown:top-3 transition-all">
            To
          </span>
        </label>
      </div>

      {/* Journey Type */}
      <div className="flex gap-3 justify-center flex-wrap">
        {[
          { key: "one_way", label: "One Way" },
          { key: "round_trip", label: "Round Trip" },
          { key: "shared", label: "Shared / Seat" },
          { key: "customize", label: "Customize" }, // ✅ NEW
        ].map((opt) => (
          <button
            type="button"
            key={opt.key}
            onClick={() =>
              setFormData((s) => ({ ...s, journey_type: opt.key }))
            }
            className={`px-4 py-2 border rounded-lg transition ${
              formData.journey_type === opt.key
                ? "bg-yellow-400 text-white border-yellow-500"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Custom Journey Fields */}
      {formData.journey_type === "customize" && (
        <div className="space-y-3 mt-3">
          <textarea
            name="custom_journey_details"
            value={formData.custom_journey_details}
            onChange={handleChange}
            placeholder="Describe your custom journey (e.g., multiple stops, special requirements)"
            className="w-full p-3 border rounded"
            rows={3}
            required
          />

          <input
            type="number"
            name="custom_rate"
            value={formData.custom_rate}
            onChange={handleChange}
            placeholder="Enter custom rate (₹)"
            className="w-full p-3 border rounded"
            required
          />

          <select
            name="custom_unit"
            value={formData.custom_unit}
            onChange={handleChange}
            className="w-full p-3 border rounded"
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

      {/* Vehicles (✅ Only available ones) */}
      <div>
        <h4 className="font-semibold mb-2">Available Vehicles</h4>
        {loadingVehicles ? (
          <p className="text-sm text-gray-500">Loading vehicles...</p>
        ) : (
          <div className="space-y-3">
            {vehicles.filter((v) => v.availability !== false).length === 0 && (
              <p className="text-sm text-gray-400">No vehicles available.</p>
            )}
            {vehicles
              .filter((v) => v.availability !== false) // ✅ only available
              .map((v) => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    selectedVehicle?.id === v.id
                      ? "ring-2 ring-yellow-400 bg-yellow-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {v.image_url ? (
                      <img
                        src={v.image_url}
                        alt={v.name}
                        className="w-10 h-10 object-contain"
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
                  <div className="font-semibold">
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
        <div className="relative flex-1">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
            🏷️
          </span>
          <input
            name="coupon_code"
            value={formData.coupon_code}
            onChange={handleChange}
            placeholder="Enter coupon code (optional)"
            className="w-full pl-8 p-2 border rounded"
          />
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded bg-yellow-400 text-white"
        >
          Apply
        </button>
      </div>

      {/* Contact Info (only if not logged in) */}
      {!user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="p-2 border rounded"
            required
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="p-2 border rounded"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 border rounded"
            required
          />
        </div>
      )}

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button
          type="submit"
          variant="book"
          className="w-full sm:w-auto"
          disabled={loading || !user} // ✅ Disable for guests
        >
          {loading ? "Submitting..." : !user ? "Login to Book" : "Book Ride"}
        </Button>
        <Button
          type="button"
          variant="blue"
          onClick={() => (window.location.href = "/")}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>

      {/* Status message */}
      {status && <p className="text-center text-sm mt-2">{status}</p>}

      {/* Login Reminder */}
      {!user && (
        <div className="mt-4 p-3 rounded-lg bg-red-100 flex items-center gap-2 text-sm">
          <span role="img" aria-label="lock">
            🔒
          </span>
          <p>
            You can explore vehicles, but{" "}
            <Link to="/login" className="text-red-600 underline font-medium">
              login
            </Link>{" "}
            to complete your booking.
          </p>
        </div>
      )}
    </form>
  );
}
