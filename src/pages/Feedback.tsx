import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2 } from "lucide-react";

const Feedback = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, comments: "" });
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/.netlify/functions/create-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setForm({ name: "", rating: 5, comments: "" });
      fetchFeedbacks();
      fetchAverageRating();

      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error("Error submitting feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/feedbacks?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch feedbacks");
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/feedbacks?select=rating`,
        {
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch ratings");
      const data = await res.json();
      if (data?.length) {
        const avg =
          data.reduce((sum: number, f: any) => sum + f.rating, 0) / data.length;
        setAverageRating(parseFloat(avg.toFixed(1)));
      }
    } catch (err) {
      console.error("Error fetching average rating:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchAverageRating();
  }, []);

  const loadMore = () => setVisibleCount((prev) => prev + 5);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#1e1e1e] border border-red-800/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.2)] text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                <CheckCircle2 size={36} className="text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Feedback Submitted</h2>
            <p className="text-gray-400">
              Thank you for sharing your experience with us!
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-[#181818] text-center border-b border-red-800/20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Customer <span className="text-red-500">Feedback</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Hear what our customers say and share your experience with us.
          </p>
          {averageRating !== null && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <Star size={24} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-semibold">{averageRating}</span>
              <span className="text-gray-400">
                ({feedbacks.length} reviews)
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Feedback Form */}
      <section className="py-16 bg-[#141414] border-b border-red-800/10">
        <div className="max-w-3xl mx-auto px-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-8 bg-[#1f1f1f] border border-red-800/30 rounded-2xl shadow-[0_0_25px_rgba(255,0,0,0.1)]"
          >
            <Input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="bg-[#121212] border border-red-800/30 text-white placeholder-gray-500"
            />

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-400">
                Your Rating
              </label>
              <div className="flex space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    className={`cursor-pointer transition-colors ${
                      star <= form.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-500"
                    }`}
                    onClick={() => setForm({ ...form, rating: star })}
                  />
                ))}
              </div>
            </div>

            <Textarea
              name="comments"
              placeholder="Your Feedback"
              value={form.comments}
              onChange={handleChange}
              rows={5}
              className="bg-[#121212] border border-red-800/30 text-white placeholder-gray-500"
            />

            <Button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </div>
      </section>

      {/* Feedback List */}
      <section className="py-20 bg-[#121212]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {feedbacks.length === 0 ? (
              <p className="text-center text-gray-400 col-span-2">
                No feedback yet. Be the first to share your experience!
              </p>
            ) : (
              feedbacks.slice(0, visibleCount).map((fb) => (
                <div
                  key={fb.id}
                  className="bg-[#1f1f1f] border border-red-800/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(255,0,0,0.1)] hover:shadow-[0_0_25px_rgba(255,0,0,0.25)] transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{fb.name}</h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={`${
                            i < fb.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-500"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-400 mb-3">{fb.comments}</p>
                  {fb.created_at && (
                    <p className="text-xs text-gray-500">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {visibleCount < feedbacks.length && (
            <div className="text-center mt-10">
              <Button
                onClick={loadMore}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full"
              >
                Load More Reviews
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default Feedback;
