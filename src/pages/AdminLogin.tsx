// src/pages/admin/AdminLogin.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.message || "Login failed");
      }

      // ✅ Save token
      localStorage.setItem("ADMIN_TOKEN", json.token);
      window.location.href = "/admin/bookings";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#111] to-[#1A1A1A] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card text-card-foreground shadow-card border border-border rounded-2xl p-8 w-full max-w-sm"
      >
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Admin Login
        </h1>

        {/* Error */}
        {error && (
          <p className="mb-4 text-red-500 bg-red-100/10 border border-red-600 rounded p-2 text-center text-sm">
            {error}
          </p>
        )}

        {/* Username */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter username"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            placeholder="Enter password"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full py-2 text-lg font-semibold rounded-full"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
