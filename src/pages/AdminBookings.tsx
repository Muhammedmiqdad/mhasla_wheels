// src/pages/AdminBookings.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle } from "lucide-react";

type Booking = {
  booking_code: string;
  id?: string;
  name: string;
  phone: string;
  email?: string;
  ride_date: string;
  pickup_location: string;
  drop_time?: string | null;
  ride_type?: string | null;
  status?: string | null;
  admin_comment?: string | null;
  created_at?: string | null;
};

export default function AdminBookings() {
  const [token, setToken] = useState<string>(
    localStorage.getItem("admin_token") || ""
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "confirmed" | "rejected"
  >("all");
  const [dateFilter, setDateFilter] = useState("");

  // Modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [rejectReason, setRejectReason] = useState("");

  // Success popup
  const [showSuccessPopup, setShowSuccessPopup] = useState<{
    type: "confirmed" | "rejected";
    booking_code: string | null;
  } | null>(null);

  const [draftToken, setDraftToken] = useState("");

  // Fetch bookings
  const fetchBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/get-booking", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setBookings([]);
        setFilteredBookings([]);
        return;
      }

      const data = await res.json();
      const items: Booking[] = data.bookings || [];
      setBookings(items);
      setFilteredBookings(items);
    } catch (e) {
      console.error("Network error fetching bookings", e);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  // Filters
  useEffect(() => {
    let results = [...bookings];
    const q = search.trim().toLowerCase();

    if (q) {
      results = results.filter(
        (b) =>
          (b.name || "").toLowerCase().includes(q) ||
          (b.phone || "").toLowerCase().includes(q) ||
          (b.booking_code || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      results = results.filter(
        (b) => (b.status || "").toLowerCase() === statusFilter
      );
    }

    if (dateFilter) {
      results = results.filter((b) => {
        try {
          return (
            new Date(b.ride_date).toISOString().split("T")[0] === dateFilter
          );
        } catch {
          return false;
        }
      });
    }

    setFilteredBookings(results);
  }, [search, statusFilter, dateFilter, bookings]);

  // update booking
  const updateBookingStatus = async (
    booking_code: string,
    status: "confirmed" | "rejected",
    reason = ""
  ) => {
    try {
      const res = await fetch("/.netlify/functions/update-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ booking_code, status, reason }),
      });

      if (!res.ok) {
        return;
      }

      // Show popup
      setShowSuccessPopup({ type: status, booking_code });

      // Hide popup after 3s
      setTimeout(() => setShowSuccessPopup(null), 3000);

      await fetchBookings();
    } catch (e) {
      console.error("Error updating booking", e);
    }
  };

  // Confirm handlers
  const openConfirmModal = (booking_code: string) => {
    setSelectedBookingId(booking_code);
    setShowConfirmModal(true);
  };

  const confirmBooking = () => {
    if (!selectedBookingId) return;
    updateBookingStatus(selectedBookingId, "confirmed");
    setShowConfirmModal(false);
  };

  // Reject handlers
  const openRejectModal = (booking_code: string) => {
    setSelectedBookingId(booking_code);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!selectedBookingId) return;
    updateBookingStatus(selectedBookingId, "rejected", rejectReason);
    setShowRejectModal(false);
  };

  // Admin login
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <Input
            placeholder="Enter admin token"
            value={draftToken}
            onChange={(e: any) => setDraftToken(e.target.value)}
            className="mb-4"
          />
          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => {
              localStorage.setItem("admin_token", draftToken.trim());
              window.location.reload();
            }}
          >
            Save & Login
          </Button>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="p-6 max-w-6xl mx-auto relative">
      {/* ✅ Success popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in">
          <div className="bg-white text-center p-8 rounded-2xl shadow-2xl max-w-sm w-full">
            <div className="flex justify-center mb-4">
              {showSuccessPopup.type === "confirmed" ? (
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 size={36} className="text-white" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                  <XCircle size={36} className="text-white" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {showSuccessPopup.type === "confirmed"
                ? "Booking Confirmed"
                : "Booking Rejected"}
            </h2>
            <p className="text-gray-500">
              Booking {showSuccessPopup.booking_code} has been{" "}
              {showSuccessPopup.type}.
            </p>
          </div>
        </div>
      )}

      {/* Sticky Header + Filters */}
      <div className="sticky top-0 z-40 bg-white border-b py-4 px-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Bookings Dashboard</h2>
          <Button
            className="btn-secondary"
            onClick={() => {
              localStorage.removeItem("admin_token");
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </div>

        {/* Filters row */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <Input
            placeholder="Search by name, phone or booking ID"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-border rounded px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e: any) => setDateFilter(e.target.value)}
          />
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={fetchBookings}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm mt-6">
        <table className="w-full table-fixed">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th className="p-3 text-left w-36">Booking Code</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Ride Date</th>
              <th className="p-3 text-left">Pickup</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b.booking_code} className="border-t">
                <td className="p-3">{b.booking_code}</td>
                <td className="p-3">{b.name}</td>
                <td className="p-3">{b.phone}</td>
                <td className="p-3">
                  {b.ride_date ? new Date(b.ride_date).toLocaleString() : "-"}
                </td>
                <td className="p-3">{b.pickup_location}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      (b.status || "").toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : (b.status || "").toLowerCase() === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {b.status || "pending"}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  {(!b.status || b.status.toLowerCase() === "pending") && (
                    <>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                        onClick={() => openConfirmModal(b.booking_code)}
                      >
                        Confirm
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1"
                        onClick={() => openRejectModal(b.booking_code)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {b.status && b.status.toLowerCase() !== "pending" && (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Confirm Booking</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to confirm booking {selectedBookingId}?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                className="btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={confirmBooking}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Reject Booking</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full border border-border rounded p-3 mb-4 resize-none"
              placeholder="Rejection reason (optional)"
            />
            <div className="flex justify-end gap-3">
              <Button
                className="btn-secondary"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmReject}
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
