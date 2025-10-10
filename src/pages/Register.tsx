// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import { FaGoogle, FaFacebook, FaInstagram } from "react-icons/fa";

// Supabase client for OAuth
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    setLoading(true);

    try {
      const result = await register(email, password, name);

      if (result.error) {
        toast.error("Registration failed", {
          description: result.error,
        });
        return;
      }

      toast.success("Please confirm your email", {
        description: "Check your inbox for the confirmation link.",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      toast.error("Registration failed", {
        description: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider: "google" | "facebook") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error("❌ Social signup failed", {
        description: err.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-[#111] to-[#1A1A1A] px-4">
      <div className="bg-card shadow-card rounded-2xl p-8 w-full max-w-md text-card-foreground border border-border">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Create an Account
        </h1>

        {/* Email + Password Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md bg-[#111] text-white border border-gray-600 focus:ring-2 focus:ring-red-600 outline-none transition"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full py-2 text-lg font-semibold rounded-full"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => handleSocialRegister("google")}
            variant="secondaryBtn"
            className="w-full flex items-center justify-center gap-2 py-2"
          >
            <FaGoogle className="text-red-500" /> Continue with Google
          </Button>
          <Button
            type="button"
            onClick={() => handleSocialRegister("facebook")}
            variant="secondaryBtn"
            className="w-full flex items-center justify-center gap-2 py-2"
          >
            <FaFacebook className="text-blue-600" /> Continue with Facebook
          </Button>
          <Button
            type="button"
            onClick={() =>
              toast.info("⚠️ Instagram OAuth requires setup in Supabase Dashboard.")
            }
            variant="secondaryBtn"
            className="w-full flex items-center justify-center gap-2 py-2"
          >
            <FaInstagram className="text-pink-500" /> Continue with Instagram
          </Button>
        </div>

        {/* Login Link */}
        <p className="text-sm text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 hover:text-red-400 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
