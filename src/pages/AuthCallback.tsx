// src/pages/AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        // Try to parse session from URL and let supabase client finish the OAuth flow.
        // getSessionFromUrl exists on many SDK versions. If it isn't present, the SDK often
        // sets session automatically and you can just rely on onAuthStateChange in your AuthContext.
        // We handle both cases gracefully.
        // @ts-ignore
        if (typeof supabase.auth.getSessionFromUrl === "function") {
          // This call exchanges the URL code for a session and stores it in localStorage/cookie (SDK).
          const { data, error } = await supabase.auth.getSessionFromUrl();
          if (error) {
            console.warn("getSessionFromUrl error", error);
          } else {
            // session likely now stored
          }
        }
      } catch (err) {
        console.warn("Auth callback parsing issue:", err);
      }

      // Let your AuthContext refresh its user info (if available)
      try {
        await refreshUser?.();
      } catch (e) {
        // non-fatal
      }

      // route user to profile or dashboard
      navigate("/profile");
    })();
  }, [navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow text-center">
        <p className="mb-2">Finalizing sign-in…</p>
        <p className="text-sm text-gray-500">If you are not redirected automatically, click <a onClick={() => window.location.href = "/profile"} className="text-blue-600 cursor-pointer">here</a>.</p>
      </div>
    </div>
  );
}
