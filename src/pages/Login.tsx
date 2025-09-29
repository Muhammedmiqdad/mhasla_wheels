// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

// ⚡ create a client for resend calls
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const Login = () => {
  const { login, refreshUser, user } = useAuth(); // ✅ always available at top level
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // 👀 Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (!user.user_metadata?.name) {
        navigate("/complete-profile");
      } else {
        navigate("/profile");
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendStatus(null);
    setLoading(true);

    try {
      const { error } = await login(email, password);

      if (error) {
        if (error.includes("Email not confirmed")) {
          setNeedsConfirmation(true);
          setError("Please confirm your email before logging in.");
        } else {
          setError(error);
        }
        return;
      }

      // ✅ Refresh metadata after login
      await refreshUser();
      // ✅ Navigation handled by useEffect (above)
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendStatus(null);
    if (!email) {
      setResendStatus("⚠️ Enter your email above first.");
      return;
    }
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    if (error) {
      setResendStatus("❌ " + error.message);
    } else {
      setResendStatus("✅ Confirmation email resent. Please check your inbox.");
    }
  };

  return ( 
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-600 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Mhasla Wheels
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              autoComplete="off" // 🚫 prevents browser autofill
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              autoComplete="new-password" // 🚫 no password manager autofill
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full py-2 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Resend confirmation email if needed */}
        {needsConfirmation && (
          <div className="mt-4 text-center">
            <Button
              onClick={handleResend}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white rounded-full py-2 transition"
            >
              Resend Confirmation Email
            </Button>
            {resendStatus && (
              <p className="mt-2 text-sm text-gray-700">{resendStatus}</p>
            )}
          </div>
        )}

        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-yellow-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
