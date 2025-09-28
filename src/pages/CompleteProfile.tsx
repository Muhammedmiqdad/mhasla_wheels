// src/pages/CompleteProfile.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // ✅ nice feedback

const CompleteProfile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.user_metadata?.name || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ redirect safely if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/.netlify/functions/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          name,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      await refreshUser(); // ✅ reload metadata

      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-600 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Logged in as <span className="font-medium">{user.email}</span>
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full py-2 transition"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
