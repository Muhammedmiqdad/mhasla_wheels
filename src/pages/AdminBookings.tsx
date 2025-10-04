// src/pages/admin/AdminBookings.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Booking {
  booking_code: string;
  name: string;
  phone: string;
  email: string;
  pickup_location: string;
  drop_location?: string;
  ride_date?: string;
  journey_type?: string;
  custom_journey_details?: string;
  custom_rate?: number | string;
  custom_unit?: string;
  depart_date?: string;
  depart_time?: string;
  return_date?: string;
  return_time?: string;
  vehicle_id?: string;
  coupon_code?: string;
  status: string;
  admin_comment?: string;
  created_at?: string;
  updated_at?: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filtered, setFiltered] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Modal
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("ADMIN_TOKEN");
    if (!token) {
      window.location.href = "/admin/login";
    } else {
      fetchBookings();
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, search, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/get-bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ADMIN_TOKEN")}`,
        },
      });
      const json = await res.json();
      if (res.ok) setBookings(json.bookings || []);
    } catch (err) {
      console.error("Fetch bookings failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...bookings];

    if (search) {
      result = result.filter(
        (b) =>
          (b.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (b.booking_code || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter === "custom") {
      result = result.filter(
        (b) =>
          !!b.custom_journey_details ||
          (b.custom_rate !== undefined && b.custom_rate !== null) ||
          !!b.custom_unit
      );
    } else if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    setFiltered(result);
    setPage(1);
  };

  const formatDateTime = (date?: string, time?: string) => {
    if (date) {
      try {
        return new Date(`${date}T${time || "00:00"}:00`).toLocaleString();
      } catch {
        return date;
      }
    }
    return null;
  };

  // Confirm booking
  const confirmBooking = async (booking_code: string) => {
    try {
      const res = await fetch("/.netlify/functions/update-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ADMIN_TOKEN")}`,
        },
        body: JSON.stringify({ booking_code, status: "confirmed" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to confirm booking");
      setMessage("✅ Booking confirmed successfully!");
      fetchBookings();
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  // Reject booking
  const rejectBooking = async (booking_code: string) => {
    const reason = prompt("Enter rejection reason (optional):") || "";
    try {
      const res = await fetch("/.netlify/functions/update-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ADMIN_TOKEN")}`,
        },
        body: JSON.stringify({ booking_code, status: "rejected", reason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to reject booking");
      setMessage("❌ Booking rejected.");
      fetchBookings();
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6">
      {/* Dashboard Header with Navigation */}
      <div className="sticky top-0 bg-white shadow-md p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-yellow-600">Admin Dashboard</h1>
          <nav className="flex gap-3">
            <a
              href="/admin/bookings"
              className="px-3 py-1 rounded font-medium bg-yellow-100 text-yellow-700"
            >
              Bookings
            </a>
            <a
              href="/admin/fleet"
              className="px-3 py-1 rounded font-medium hover:bg-gray-100"
            >
              Fleet
            </a>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="custom">Custom Only</option>
          </select>
          <Button onClick={fetchBookings} variant="book">
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem("ADMIN_TOKEN");
              window.location.href = "/admin/login";
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* ✅ Dashboard Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-yellow-600">
            {bookings.length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === "pending").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">
            {bookings.filter((b) => b.status === "confirmed").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-600">
            {bookings.filter((b) => b.status === "rejected").length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 text-sm">Custom</p>
          <p className="text-2xl font-bold text-blue-600">
            {bookings.filter(
              (b) => b.custom_journey_details || b.custom_rate || b.custom_unit
            ).length}
          </p>
        </div>
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
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Customer</th>
                <th className="p-3 border">Journey</th>
                <th className="p-3 border">Custom</th>
                <th className="p-3 border">Pickup</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((b) => {
                const hasCustom =
                  !!b.custom_journey_details ||
                  (b.custom_rate !== undefined && b.custom_rate !== null) ||
                  !!b.custom_unit;

                return (
                  <tr key={b.booking_code} className="hover:bg-gray-50">
                    <td className="p-3 border font-mono">{b.booking_code}</td>
                    <td className="p-3 border">
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-gray-500">{b.phone}</div>
                    </td>
                    <td className="p-3 border capitalize">
                      {b.journey_type || "-"}
                    </td>
                    <td className="p-3 border">
                      {hasCustom ? (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                          Yes
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          No
                        </span>
                      )}
                    </td>
                    <td className="p-3 border">{b.pickup_location || "-"}</td>
                    <td
                      className={`p-3 border font-semibold capitalize ${
                        b.status === "pending"
                          ? "text-yellow-600"
                          : b.status === "confirmed"
                          ? "text-green-600"
                          : b.status === "rejected"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {b.status}
                    </td>
                    <td className="p-3 border flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelected(b)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => confirmBooking(b.booking_code)}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectBooking(b.booking_code)}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-3 bg-gray-50 border-t">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full relative">
            <h2 className="text-xl font-bold mb-4 text-yellow-600">
              Booking Details
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Code:</strong> {selected.booking_code}
              </p>
              <p>
                <strong>Name:</strong> {selected.name} ({selected.phone})
              </p>
              <p>
                <strong>Email:</strong> {selected.email || "-"}
              </p>
              <p>
                <strong>Pickup:</strong> {selected.pickup_location}
              </p>
              <p>
                <strong>Drop:</strong> {selected.drop_location || "-"}
              </p>
              <p>
                <strong>Journey:</strong> {selected.journey_type || "-"}
              </p>

              {selected.custom_journey_details && (
                <p>
                  <strong>Custom Details:</strong>{" "}
                  {selected.custom_journey_details}
                </p>
              )}
              {selected.custom_rate && (
                <p>
                  <strong>Custom Rate:</strong> ₹{selected.custom_rate}
                </p>
              )}
              {selected.custom_unit && (
                <p>
                  <strong>Unit:</strong> {selected.custom_unit}
                </p>
              )}

              {selected.depart_date && (
                <p>
                  <strong>Depart:</strong>{" "}
                  {formatDateTime(selected.depart_date, selected.depart_time)}
                </p>
              )}
              {selected.return_date && (
                <p>
                  <strong>Return:</strong>{" "}
                  {formatDateTime(selected.return_date, selected.return_time)}
                </p>
              )}
              {selected.ride_date && (
                <p>
                  <strong>Ride Date:</strong>{" "}
                  {new Date(selected.ride_date).toLocaleString()}
                </p>
              )}
              <p>
                <strong>Vehicle ID:</strong> {selected.vehicle_id || "-"}
              </p>
              <p>
                <strong>Coupon:</strong> {selected.coupon_code || "-"}
              </p>
              <p>
                <strong>Status:</strong> {selected.status}
              </p>
              {selected.admin_comment && (
                <p>
                  <strong>Admin Note:</strong> {selected.admin_comment}
                </p>
              )}
              <p>
                <strong>Created:</strong>{" "}
                {selected.created_at
                  ? new Date(selected.created_at).toLocaleString()
                  : "-"}
              </p>
              <p>
                <strong>Updated:</strong>{" "}
                {selected.updated_at
                  ? new Date(selected.updated_at).toLocaleString()
                  : "-"}
              </p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
