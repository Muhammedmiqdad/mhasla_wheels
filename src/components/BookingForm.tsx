import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    distance_km: "",
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
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);

  const locationOptions = [
    "Kuwait City",
    "Mangaf",
    "Salmiya",
    "Fahaheel",
    "Hawally",
    "Jabriya",
    "Farwaniya",
  ];

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

  // 🧮 Calculate estimated fare dynamically
  useEffect(() => {
    if (!selectedVehicle) {
      setEstimatedFare(null);
      return;
    }

    const rate =
      selectedVehicle.per_km_rate ||
      selectedVehicle.base_rate ||
      (formData.custom_rate ? parseFloat(formData.custom_rate) : 0);

    const distance = parseFloat(formData.distance_km) || 0;
    let estimate = 0;

    if (formData.journey_type === "customize") {
      estimate = rate;
    } else if (formData.journey_type === "one_way") {
      estimate = distance * rate;
    } else if (formData.journey_type === "round_trip") {
      estimate = distance * rate * 2;
    } else if (formData.journey_type === "shared") {
      estimate = distance * rate * 0.6; // discounted for shared
    }

    setEstimatedFare(Math.max(estimate, selectedVehicle.base_rate || 0));
  }, [selectedVehicle, formData.distance_km, formData.journey_type, formData.custom_rate]);

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
        estimated_fare: estimatedFare,
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
      {/* Pickup & Drop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          name="from"
          value={formData.from}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
        >
          <option value="">Select Pickup Location</option>
          {locationOptions.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          name="to"
          value={formData.to}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
        >
          <option value="">Select Drop Location</option>
          {locationOptions.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Journey Type */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {[
          { key: "one_way", label: "One Way" },
          { key: "round_trip", label: "Round Trip" },
          { key: "shared", label: "Shared / Seat" },
          { key: "customize", label: "Customize" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, journey_type: opt.key }))
            }
            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
              formData.journey_type === opt.key
                ? "bg-red-600 text-white border-red-600 shadow-md scale-105"
                : "bg-[#111] text-gray-300 border-gray-700 hover:bg-[#1a1a1a] hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Distance Input */}
      {formData.journey_type !== "customize" && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Approx Distance (km)
          </label>
          <input
            type="number"
            name="distance_km"
            value={formData.distance_km}
            onChange={handleChange}
            placeholder="Enter estimated distance"
            className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
            required
          />
        </div>
      )}

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Pickup Date & Time
          </label>
          <ReactDatePicker
            selected={
              formData.depart_date
                ? new Date(
                    formData.depart_date +
                      "T" +
                      (formData.depart_time || "00:00")
                  )
                : null
            }
            onChange={(date: Date | null) => {
              if (date) {
                setFormData((prev) => ({
                  ...prev,
                  depart_date: date.toISOString().split("T")[0],
                  depart_time: date.toTimeString().slice(0, 5),
                }));
              }
            }}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Select date and time"
            className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
            minDate={new Date()}
          />
        </div>

        {formData.journey_type === "round_trip" && (
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Return Date & Time
            </label>
            <ReactDatePicker
              selected={
                formData.return_date
                  ? new Date(
                      formData.return_date +
                        "T" +
                        (formData.return_time || "00:00")
                    )
                  : null
              }
              onChange={(date: Date | null) => {
                if (date) {
                  setFormData((prev) => ({
                    ...prev,
                    return_date: date.toISOString().split("T")[0],
                    return_time: date.toTimeString().slice(0, 5),
                  }));
                }
              }}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select return date and time"
              className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
              minDate={
                formData.depart_date
                  ? new Date(formData.depart_date)
                  : new Date()
              }
            />
          </div>
        )}
      </div>

      {/* Custom Journey */}
      {formData.journey_type === "customize" && (
        <div className="space-y-3 mt-3">
          <textarea
            name="custom_journey_details"
            value={formData.custom_journey_details}
            onChange={handleChange}
            placeholder="Describe your custom journey..."
            className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
            rows={3}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="number"
              name="custom_rate"
              value={formData.custom_rate}
              onChange={handleChange}
              placeholder="Custom Rate (₹)"
              className="w-full p-3 bg-[#111] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-red-500 outline-none"
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
        </div>
      )}

      {/* Vehicle Selection */}
      <div>
        <h4 className="font-semibold mb-2 text-gray-300">Available Vehicles</h4>
        {loadingVehicles ? (
          <p className="text-sm text-gray-500">Loading vehicles...</p>
        ) : (
          <div className="space-y-3">
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

      {/* Live Fare Estimate */}
      {estimatedFare && (
        <div className="mt-4 p-4 rounded-lg bg-red-600/10 border border-red-600 text-center">
          <p className="text-lg font-semibold text-white">
            💰 Estimated Fare:{" "}
            <span className="text-red-500">₹{estimatedFare.toFixed(2)}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            (Approximate fare — actual total may vary based on distance and time)
          </p>
        </div>
      )}

      {/* Guest Info */}
      {!user && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="p-3 bg-[#111] border border-gray-700 rounded-lg text-white placeholder-gray-400"
              required
            />
          </div>

          <p className="text-sm text-gray-400 text-center mt-2">
            Don’t have an account?{" "}
            <Link to="/register" className="text-red-500 hover:text-red-400">
              Register here
            </Link>
          </p>
        </>
      )}

      {/* Submit Buttons */}
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

      {status && (
        <p className="text-center text-sm mt-2 text-gray-300">{status}</p>
      )}
    </form>
  );
}
