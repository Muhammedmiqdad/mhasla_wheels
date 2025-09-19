import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Feedback = () => {
  const [form, setForm] = useState({ name: "", rating: 5, comments: "" });
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/.netlify/functions/create-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", rating: 5, comments: "" });
    fetchFeedbacks();
  };

  const fetchFeedbacks = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/feedbacks?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      }
    );
    const data = await res.json();
    setFeedbacks(data);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Feedback</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-12">
        <Input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <select
          name="rating"
          value={form.rating}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="5">⭐️⭐️⭐️⭐️⭐️ (5)</option>
          <option value="4">⭐️⭐️⭐️⭐️ (4)</option>
          <option value="3">⭐️⭐️⭐️ (3)</option>
          <option value="2">⭐️⭐️ (2)</option>
          <option value="1">⭐️ (1)</option>
        </select>
        <Textarea
          name="comments"
          placeholder="Your Feedback"
          value={form.comments}
          onChange={handleChange}
        />

        {/* ✅ Primary action button (Red) */}
        <Button type="submit" className="w-full btn-primary">
          Submit Feedback
        </Button>
      </form>

      {/* Feedback List */}
      <h2 className="text-2xl font-semibold mb-4">What others said</h2>
      <div className="space-y-4">
        {feedbacks.map((fb) => (
          <div
            key={fb.id}
            className="p-4 border rounded shadow-sm bg-white"
          >
            <p className="font-semibold">
              {fb.name} – ⭐ {fb.rating}
            </p>
            <p className="text-sm text-gray-600">{fb.comments}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
