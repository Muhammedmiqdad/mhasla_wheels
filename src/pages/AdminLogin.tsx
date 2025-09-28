// src/pages/admin/AdminLogin.tsx
import { useState } from "react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-4 text-center text-yellow-600">
          Admin Login
        </h1>

        {error && (
          <p className="mb-3 text-red-500 text-sm text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
