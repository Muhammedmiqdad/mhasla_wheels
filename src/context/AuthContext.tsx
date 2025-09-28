// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { createClient, User } from "@supabase/supabase-js";

// ✅ Supabase client (frontend uses anon key)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>; // ✅ new helper
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Initialize session once on mount
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setUser(data.session?.user || null);
        setLoading(false);
      }
    };

    initSession();

    // ✅ Listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ Login
  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  // ✅ Register (with name)
  const register = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // store name in metadata
      },
    });
    return error ? { error: error.message } : {};
  };

  // ✅ Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); // clear local state immediately
  };

  // ✅ Refresh user after updating metadata (e.g. CompleteProfile)
  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) setUser(data.user);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
