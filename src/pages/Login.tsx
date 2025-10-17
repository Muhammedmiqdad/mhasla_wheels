// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaGoogle, FaFacebook, FaInstagram } from "react-icons/fa";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const Login = () => {
  const { login, refreshUser, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!user.user_metadata?.name) navigate("/complete-profile");
      else navigate("/profile");
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
        } else setError(error);
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
    if (!email) {
      setResendStatus("⚠️ Enter your email above first.");
      return;
    }
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) setResendStatus("❌ " + error.message);
    else setResendStatus("✅ Confirmation email resent. Check your inbox.");
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: any) {
      setError("❌ Social login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-[#181818] text-center border-b border-red-800/20">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Login to <span className="text-red-500">Mhasla Wheels</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Access your account to manage bookings and preferences.
          </p>
        </div>
      </section>

      {/* Login Card */}
      <section className="flex-grow py-16 bg-[#141414] border-b border-red-800/10">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-[#1f1f1f] border border-red-800/30 rounded-2xl p-8 shadow-[0_0_25px_rgba(255,0,0,0.15)]">
            {error && (
              <div className="mb-4 text-sm text-red-400 border border-red-700/40 bg-red-900/20 p-2 rounded text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-400">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-md bg-[#121212] text-white border border-red-800/30 focus:ring-2 focus:ring-red-600 outline-none transition"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white text-lg font-semibold transition"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {needsConfirmation && (
              <div className="mt-4 text-center">
                <Button
                  onClick={handleResend}
                  className="w-full py-2 rounded-full bg-[#1a1a1a] border border-red-800/30 hover:bg-red-600/20 transition"
                >
                  Resend Confirmation Email
                </Button>
                {resendStatus && (
                  <p className="mt-2 text-sm text-gray-400">{resendStatus}</p>
                )}
              </div>
            )}

            <div className="my-6 flex items-center">
              <div className="flex-grow h-px bg-red-800/20"></div>
              <span className="mx-3 text-gray-500 text-sm">or</span>
              <div className="flex-grow h-px bg-red-800/20"></div>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              <Button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#222] border border-red-800/30 rounded-full hover:bg-red-600/20 transition"
              >
                <FaGoogle className="text-red-500" /> Continue with Google
              </Button>
              <Button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#222] border border-red-800/30 rounded-full hover:bg-red-600/20 transition"
              >
                <FaFacebook className="text-blue-600" /> Continue with Facebook
              </Button>
              <Button
                type="button"
                onClick={() =>
                  alert("⚠️ Instagram OAuth requires setup in Supabase Dashboard.")
                }
                className="w-full flex items-center justify-center gap-2 py-2 bg-[#222] border border-red-800/30 rounded-full hover:bg-red-600/20 transition"
              >
                <FaInstagram className="text-pink-500" /> Continue with Instagram
              </Button>
            </div>

            <p className="text-sm text-center mt-6 text-gray-400">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-red-500 hover:text-red-400 font-semibold"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
