// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Booking {
  booking_code: string;
  pickup_location: string | null;
  drop_location?: string | null;
  journey_type?: string | null;
  status?: string | null;
  created_at?: string | null;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Friendly display name (prefer user_metadata.name)
  const displayName =
    user?.user_metadata?.name || (user?.email ? user.email.split("@")[0] : "Guest");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchBookings = async (customer_id: string) => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(
        `/.netlify/functions/get-customer-bookings?customer_id=${encodeURIComponent(
          customer_id
        )}`
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to fetch bookings");
      }
      const json = await res.json();
      setBookings(json.bookings || []);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setFetchError(err.message || "Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      navigate("/");
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-600 px-4 py-20">
        <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-2xl mx-auto text-center animate-fade-in">
          {/* Avatar & Basic Info */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-yellow-500 text-white text-2xl font-bold shadow-md mb-3">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome, {displayName} 👋
            </h1>
            <p className="text-gray-600">
              Logged in as:{" "}
              <span className="font-medium text-gray-800">{user.email}</span>
            </p>
          </div>

          {/* Bookings Section */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            My Bookings
          </h2>

          {loading ? (
            <p className="text-gray-500 mb-4">Loading bookings...</p>
          ) : fetchError ? (
            <p className="text-red-600 mb-4">{fetchError}</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500 mb-4">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-4">
              <table className="min-w-[700px] w-full border-collapse text-sm text-left">
                <thead>
                  <tr className="bg-yellow-100">
                    <th className="p-2 border">Code</th>
                    <th className="p-2 border">Pickup</th>
                    <th className="p-2 border">Drop</th>
                    <th className="p-2 border">Journey</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.booking_code} className="hover:bg-gray-50">
                      <td className="p-2 border align-top">{b.booking_code}</td>
                      <td className="p-2 border align-top">
                        {b.pickup_location || "-"}
                      </td>
                      <td className="p-2 border align-top">
                        {b.drop_location || "-"}
                      </td>
                      <td className="p-2 border align-top">
                        {b.journey_type || "-"}
                      </td>
                      <td
                        className={`p-2 border font-semibold capitalize align-top ${
                          b.status === "pending"
                            ? "text-yellow-600"
                            : b.status === "confirmed"
                            ? "text-green-600"
                            : b.status === "rejected"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {b.status || "-"}
                      </td>
                      <td className="p-2 border align-top">
                        {b.created_at
                          ? new Date(b.created_at).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/booking"
              className="w-full sm:w-auto inline-block bg-yellow-500 hover:bg-yellow-600 text-white text-center rounded-full px-6 py-2 font-medium transition"
            >
              Book a Ride
            </Link>
            <Button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 transition"
            >
              Logout
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Profile;
