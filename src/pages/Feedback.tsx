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

      // ✅ Show popup
      setShowPopup(true);

      // ✅ Auto-close popup + redirect to home
      setTimeout(() => {
        setShowPopup(false);
        window.location.href = "/";
      }, 3000);
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

      if (data && data.length > 0) {
        const avg =
          data.reduce((sum: number, f: any) => sum + f.rating, 0) /
          data.length;
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
    <div className="min-h-screen bg-background relative">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />

      {/* ✅ Modern Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 animate-fade-in">
          <div className="bg-card text-card-foreground p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform animate-scale-in">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle2 size={36} className="text-primary-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Feedback Submitted</h2>
            <p className="text-muted-foreground">
              Thank you for sharing your experience with us!
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-24 section-padding bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h1 className="text-responsive-xl font-bold mb-6 animate-fade-in-up">
            Customer Feedback
          </h1>
          <p className="text-responsive-md opacity-90 animate-fade-in-up">
            Hear what our customers say and share your own experience with
            Mhasla Wheels.
          </p>

          {averageRating !== null && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <Star size={24} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xl font-semibold">{averageRating}</span>
              <span className="opacity-80">({feedbacks.length} reviews)</span>
            </div>
          )}
        </div>
      </section>

      {/* Feedback Form */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto container-padding">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-6 bg-card border border-border rounded-xl shadow-card"
          >
            <Input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
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
                        : "text-gray-400"
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
            />

            <Button
              type="submit"
              variant="book"
              className="w-full py-3"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </div>
      </section>

      {/* Feedback List */}
      <section className="section-padding bg-muted">
        <div className="max-w-6xl mx-auto container-padding">
          <h2 className="text-responsive-lg font-bold text-center mb-12 text-foreground">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {feedbacks.length === 0 ? (
              <p className="text-center text-muted-foreground col-span-2">
                No feedback yet. Be the first to share your experience!
              </p>
            ) : (
              feedbacks.slice(0, visibleCount).map((fb) => (
                <div
                  key={fb.id}
                  className="bg-card border border-primary/30 rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-card-foreground">
                      {fb.name}
                    </h3>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={`${
                            i < fb.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{fb.comments}</p>
                  {fb.created_at && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {visibleCount < feedbacks.length && (
            <div className="text-center mt-10">
              <Button onClick={loadMore} variant="blue" className="px-8 py-3">
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
