// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { FaGoogle, FaFacebook, FaInstagram } from "react-icons/fa";

// ⚡ create a client for resend calls + OAuth
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const Login = () => {
  const { login, refreshUser, user } = useAuth();
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

      await refreshUser();
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

  // 🔑 Social Login
  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError("❌ Social login failed: " + err.message);
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

        {/* Email + Password Form FIRST */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              autoComplete="off"
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
              autoComplete="new-password"
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

        {/* Resend Confirmation */}
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

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Social Login SECOND */}
        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50"
          >
            <FaGoogle className="text-red-500" /> Continue with Google
          </Button>
          <Button
            type="button"
            onClick={() => handleSocialLogin("facebook")}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50"
          >
            <FaFacebook className="text-blue-600" /> Continue with Facebook
          </Button>
          <Button
            type="button"
            onClick={() =>
              alert("⚠️ Instagram OAuth requires custom setup in Supabase")
            }
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50"
          >
            <FaInstagram className="text-pink-500" /> Continue with Instagram
          </Button>
        </div>

        {/* Register Link */}
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
