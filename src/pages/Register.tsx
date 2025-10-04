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

      // ✅ Success flow
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

  // 🔑 Social Registration/Login
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 to-yellow-600 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h1>

        {/* Default Registration (Email + Password) */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full py-2 transition"
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Social Registration SECOND */}
        <div className="space-y-3">
          <Button
            type="button"
            onClick={() => handleSocialRegister("google")}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50"
          >
            <FaGoogle className="text-red-500" /> Continue with Google
          </Button>
          <Button
            type="button"
            onClick={() => handleSocialRegister("facebook")}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50"
          >
            <FaFacebook className="text-blue-600" /> Continue with Facebook
          </Button>
          <Button
            type="button"
            onClick={() =>
              toast.info("⚠️ Instagram OAuth requires custom setup in Supabase")
            }
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50"
          >
            <FaInstagram className="text-pink-500" /> Continue with Instagram
          </Button>
        </div>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
