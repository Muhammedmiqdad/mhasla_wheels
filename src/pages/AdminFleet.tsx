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

  // Modal / Form
  const [showForm, setShowForm] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    per_km_rate: "",
    base_rate: "",
    image_url: "",
    availability: true, // ✅ default true
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

  // ✅ Save vehicle (Add / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editVehicle ? "PUT" : "POST";
    const url = editVehicle
      ? "/.netlify/functions/update-vehicle"
      : "/.netlify/functions/create-vehicle";

    // ✅ Clean numeric fields
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

  // ✅ Toggle availability inline
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

      // update local state
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, availability: newValue } : v))
      );
      setMessage("✅ Availability updated!");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  // ✅ Delete vehicle
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
    <div className="p-6">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow-md p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-yellow-600">Manage Fleet</h1>
          <nav className="flex gap-3">
            <a
              href="/admin/bookings"
              className="px-3 py-1 rounded font-medium hover:bg-gray-100"
            >
              Bookings
            </a>
            <a
              href="/admin/fleet"
              className="px-3 py-1 rounded font-medium bg-yellow-100 text-yellow-700"
            >
              Fleet
            </a>
          </nav>
        </div>
        <Button onClick={() => setShowForm(true)} variant="book">
          + Add Vehicle
        </Button>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-4 p-3 rounded bg-yellow-100 border-l-4 border-yellow-500 text-sm">
          {message}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-yellow-50 text-left">
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Capacity</th>
                <th className="p-3 border">Rates</th>
                <th className="p-3 border">Available</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    {v.image_url ? (
                      <img
                        src={v.image_url}
                        alt={v.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 border font-medium">{v.name}</td>
                  <td className="p-3 border">{v.type || "-"}</td>
                  <td className="p-3 border">{v.capacity || "-"}</td>
                  <td className="p-3 border">
                    {v.per_km_rate
                      ? `₹${v.per_km_rate}/km`
                      : v.base_rate
                      ? `₹${v.base_rate}`
                      : "-"}
                  </td>
                  {/* ✅ Toggle availability inline */}
                  <td className="p-3 border">
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
                          v.availability ? "bg-green-500" : "bg-gray-300"
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
                  <td className="p-3 border flex gap-2">
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4 text-yellow-600">
              {editVehicle ? "Edit Vehicle" : "Add Vehicle"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Vehicle Name"
                className="p-2 border rounded w-full"
                required
              />
              <input
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Type (SUV, Sedan, etc.)"
                className="p-2 border rounded w-full"
              />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Capacity (seats)"
                className="p-2 border rounded w-full"
              />
              <input
                type="number"
                name="per_km_rate"
                value={formData.per_km_rate}
                onChange={handleChange}
                placeholder="Rate per km"
                className="p-2 border rounded w-full"
              />
              <input
                type="number"
                name="base_rate"
                value={formData.base_rate}
                onChange={handleChange}
                placeholder="Base rate"
                className="p-2 border rounded w-full"
              />
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Image URL"
                className="p-2 border rounded w-full"
              />

              {/* ✅ Availability Toggle */}
              <label className="flex items-center gap-2">
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
                <Button type="submit" variant="book">
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
