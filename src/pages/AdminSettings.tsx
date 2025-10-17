import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";

interface Settings {
  id?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsapp_link?: string;
  instagram_link?: string;
  facebook_link?: string;
}

export default function AdminSettings() {
  const [form, setForm] = useState<Settings>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("ADMIN_TOKEN");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("settings").select("*").limit(1).single();
      if (error) throw error;
      setForm(data || {});
    } catch (err: any) {
      console.error("Fetch settings error:", err);
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("⏳ Updating settings...");

    try {
      const res = await fetch("/.netlify/functions/update-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ADMIN_TOKEN")}`,
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update settings");

      setMessage("✅ Settings updated successfully!");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      {/* Header */}
      <div className="sticky top-0 bg-[#111] border-b border-gray-700 shadow-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 z-10 rounded-xl">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-red-500">Admin Settings</h1>
          <nav className="flex gap-3">
            <a
              href="/admin/bookings"
              className="px-3 py-1 rounded-md font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
            >
              Bookings
            </a>
            <a
              href="/admin/fleet"
              className="px-3 py-1 rounded-md font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
            >
              Fleet
            </a>
            <a
              href="/admin/settings"
              className="px-3 py-1 rounded-md font-medium bg-red-600 text-white hover:bg-red-700 transition"
            >
              Settings
            </a>
          </nav>
        </div>
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

      {message && (
        <div className="mb-4 p-3 rounded bg-red-500/10 border-l-4 border-red-600 text-sm text-gray-200">
          {message}
        </div>
      )}

      {/* Settings Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-[#111] p-6 rounded-xl border border-gray-800 shadow-xl space-y-5"
      >
        <div>
          <label className="text-sm font-semibold text-gray-300">Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            className="mt-1 w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded text-white placeholder-gray-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
            className="mt-1 w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded text-white placeholder-gray-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-300">Address</label>
          <textarea
            name="address"
            value={form.address || ""}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded text-white placeholder-gray-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-300">WhatsApp Link</label>
          <input
            type="text"
            name="whatsapp_link"
            value={form.whatsapp_link || ""}
            onChange={handleChange}
            placeholder="https://wa.me/..."
            className="mt-1 w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded text-white"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-300">Instagram Link</label>
          <input
            type="text"
            name="instagram_link"
            value={form.instagram_link || ""}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
            className="mt-1 w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded text-white"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-300">Facebook Link</label>
          <input
            type="text"
            name="facebook_link"
            value={form.facebook_link || ""}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
            className="mt-1 w-full p-2 bg-[#1A1A1A] border border-gray-700 rounded text-white"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
