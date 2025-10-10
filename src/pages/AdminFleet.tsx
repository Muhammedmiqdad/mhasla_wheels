// src/pages/admin/AdminFleet.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Vehicle {
  id: string;
  name: string;
  type?: string;
  capacity?: number;
  per_km_rate?: number;
  base_rate?: number;
  image_url?: string;
  availability?: boolean;
  created_at?: string;
}

export default function AdminFleet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    per_km_rate: "",
    base_rate: "",
    image_url: "",
    availability: true,
  });

  // ✅ Protect route
  useEffect(() => {
    const token = localStorage.getItem("ADMIN_TOKEN");
    if (!token) {
      window.location.href = "/admin/login";
    } else {
      fetchVehicles();
    }
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/get-vehicles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ADMIN_TOKEN")}`,
        },
      });
      const json = await res.json();
      if (res.ok && json.vehicles) {
        setVehicles(json.vehicles);
      }
    } catch (err) {
      console.error("Fetch vehicles failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editVehicle ? "PUT" : "POST";
    const url = editVehicle
      ? "/.netlify/functions/update-vehicle"
      : "/.netlify/functions/create-vehicle";

    const cleanPayload: any = {
      ...formData,
      id: editVehicle?.id,
      capacity: formData.capacity === "" ? null : Number(formData.capacity),
      per_km_rate:
        formData.per_km_rate === "" ? null : Number(formData.per_km_rate),
      base_rate: formData.base_rate === "" ? null : Number(formData.base_rate),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ADMIN_TOKEN")}`,
        },
        body: JSON.stringify(cleanPayload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save vehicle");

      setMessage(editVehicle ? "✅ Vehicle updated!" : "✅ Vehicle added!");
      setShowForm(false);
      setEditVehicle(null);
      setFormData({
        name: "",
        type: "",
        capacity: "",
        per_km_rate: "",
        base_rate: "",
        image_url: "",
        availability: true,
      });
      fetchVehicles();
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  const toggleAvailability = async (id: string, newValue: boolean) => {
    try {
      const res = await fetch("/.netlify/functions/update-vehicle", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ADMIN_TOKEN")}`,
        },
        body: JSON.stringify({ id, availability: newValue }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update availability");

      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, availability: newValue } : v))
      );
      setMessage("✅ Availability updated!");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const res = await fetch("/.netlify/functions/delete-vehicle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ADMIN_TOKEN")}`,
        },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete vehicle");
      setMessage("✅ Vehicle deleted.");
      fetchVehicles();
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      {/* Header */}
      <div className="sticky top-0 bg-[#111] border-b border-gray-700 shadow-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 z-10 rounded-xl">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-red-500">Manage Fleet</h1>
          <nav className="flex gap-3">
            <a
              href="/admin/bookings"
              className="px-3 py-1 rounded-md font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
            >
              Bookings
            </a>
            <a
              href="/admin/fleet"
              className="px-3 py-1 rounded-md font-medium bg-red-600 text-white hover:bg-red-700 transition"
            >
              Fleet
            </a>
          </nav>
        </div>
        <Button onClick={() => setShowForm(true)} variant="primary">
          + Add Vehicle
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 p-3 rounded bg-red-500/10 border-l-4 border-red-600 text-sm text-gray-200">
          {message}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-[#111] border border-gray-800 rounded-xl shadow-lg">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#1A1A1A] text-gray-300">
                <th className="p-3 border-b border-gray-700">Image</th>
                <th className="p-3 border-b border-gray-700">Name</th>
                <th className="p-3 border-b border-gray-700">Type</th>
                <th className="p-3 border-b border-gray-700">Capacity</th>
                <th className="p-3 border-b border-gray-700">Rates</th>
                <th className="p-3 border-b border-gray-700">Available</th>
                <th className="p-3 border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-[#1E1E1E] transition">
                  <td className="p-3 border-b border-gray-800">
                    {v.image_url ? (
                      <img
                        src={v.image_url}
                        alt={v.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="p-3 border-b border-gray-800 font-medium text-white">
                    {v.name}
                  </td>
                  <td className="p-3 border-b border-gray-800 text-gray-400">
                    {v.type || "-"}
                  </td>
                  <td className="p-3 border-b border-gray-800 text-gray-400">
                    {v.capacity || "-"}
                  </td>
                  <td className="p-3 border-b border-gray-800 text-gray-400">
                    {v.per_km_rate
                      ? `₹${v.per_km_rate}/km`
                      : v.base_rate
                      ? `₹${v.base_rate}`
                      : "-"}
                  </td>
                  <td className="p-3 border-b border-gray-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={v.availability ?? false}
                        onChange={(e) =>
                          toggleAvailability(v.id, e.target.checked)
                        }
                        className="hidden"
                      />
                      <span
                        className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
                          v.availability ? "bg-green-600" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${
                            v.availability ? "translate-x-5" : ""
                          }`}
                        />
                      </span>
                    </label>
                  </td>
                  <td className="p-3 border-b border-gray-800 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditVehicle(v);
                        setFormData({
                          name: v.name,
                          type: v.type || "",
                          capacity: v.capacity?.toString() || "",
                          per_km_rate: v.per_km_rate?.toString() || "",
                          base_rate: v.base_rate?.toString() || "",
                          image_url: v.image_url || "",
                          availability: v.availability ?? true,
                        });
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteVehicle(v.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full text-gray-200">
            <h2 className="text-lg font-bold mb-4 text-red-500">
              {editVehicle ? "Edit Vehicle" : "Add Vehicle"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Vehicle Name"
                className="p-2 bg-[#1A1A1A] border border-gray-700 rounded w-full text-white placeholder-gray-500"
                required
              />
              <input
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Type (SUV, Sedan, etc.)"
                className="p-2 bg-[#1A1A1A] border border-gray-700 rounded w-full text-white placeholder-gray-500"
              />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Capacity (seats)"
                className="p-2 bg-[#1A1A1A] border border-gray-700 rounded w-full text-white placeholder-gray-500"
              />
              <input
                type="number"
                name="per_km_rate"
                value={formData.per_km_rate}
                onChange={handleChange}
                placeholder="Rate per km"
                className="p-2 bg-[#1A1A1A] border border-gray-700 rounded w-full text-white placeholder-gray-500"
              />
              <input
                type="number"
                name="base_rate"
                value={formData.base_rate}
                onChange={handleChange}
                placeholder="Base rate"
                className="p-2 bg-[#1A1A1A] border border-gray-700 rounded w-full text-white placeholder-gray-500"
              />
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Image URL"
                className="p-2 bg-[#1A1A1A] border border-gray-700 rounded w-full text-white placeholder-gray-500"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleChange}
                />
                Available
              </label>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditVehicle(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editVehicle ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
