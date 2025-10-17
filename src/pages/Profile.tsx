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

  const displayName =
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "Guest");

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

      <main className="min-h-screen bg-[#121212] text-white px-4 py-20">
        <div className="bg-[#1f1f1f] border border-red-800/30 shadow-[0_0_25px_rgba(255,0,0,0.15)] rounded-2xl p-6 sm:p-8 w-full max-w-3xl mx-auto text-center animate-fade-in">
          {/* Profile Info */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto flex items-center justify-center rounded-full bg-red-600 text-white text-3xl font-bold shadow-[0_0_20px_rgba(255,0,0,0.4)] mb-4">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-3xl font-extrabold mb-1">
              Welcome, <span className="text-red-400">{displayName}</span> 👋
            </h1>
            <p className="text-gray-400">
              Logged in as:{" "}
              <span className="text-gray-200 font-medium">{user.email}</span>
            </p>
          </div>

          {/* My Bookings */}
          <h2 className="text-xl font-bold text-white mb-5 border-b border-red-800/30 pb-2">
            My Bookings
          </h2>

          {loading ? (
            <p className="text-gray-400 mb-4">Loading your bookings...</p>
          ) : fetchError ? (
            <p className="text-red-500 mb-4">{fetchError}</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-400 mb-4">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
              <table className="min-w-[700px] w-full border-collapse text-sm text-left">
                <thead>
                  <tr className="bg-[#181818] border-b border-red-800/30 text-gray-300">
                    <th className="p-3 font-medium">Code</th>
                    <th className="p-3 font-medium">Pickup</th>
                    <th className="p-3 font-medium">Drop</th>
                    <th className="p-3 font-medium">Journey</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, index) => (
                    <tr
                      key={b.booking_code || index}
                      className="hover:bg-[#2a2a2a] transition"
                    >
                      <td className="p-3 border-t border-red-800/20 text-gray-200">
                        {b.booking_code}
                      </td>
                      <td className="p-3 border-t border-red-800/20 text-gray-400">
                        {b.pickup_location || "-"}
                      </td>
                      <td className="p-3 border-t border-red-800/20 text-gray-400">
                        {b.drop_location || "-"}
                      </td>
                      <td className="p-3 border-t border-red-800/20 text-gray-400">
                        {b.journey_type || "-"}
                      </td>
                      <td
                        className={`p-3 border-t border-red-800/20 font-semibold capitalize ${
                          b.status === "pending"
                            ? "text-yellow-400"
                            : b.status === "confirmed"
                            ? "text-green-400"
                            : b.status === "rejected"
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        {b.status || "-"}
                      </td>
                      <td className="p-3 border-t border-red-800/20 text-gray-400">
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
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-center rounded-full px-6 py-3 font-semibold transition"
            >
              Book a Ride
            </Link>
            <Button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-[#2a2a2a] border border-red-800/30 hover:bg-red-600/20 text-white rounded-full px-6 py-3 transition"
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
