// src/App.tsx
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Fleet from "./pages/Fleet";
import Contact from "./pages/Contact";
import BookingPage from "./pages/BookingPage";
import ThankYou from "./pages/ThankYou";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import CompleteProfile from "./pages/CompleteProfile";

// ✅ Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminBookings from "./pages/AdminBookings";

// ✅ Customer pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// ✅ Loader
import LoadingScreen from "@/components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [startFadeIn, setStartFadeIn] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const handleLoadingComplete = () => {
    setStartFadeIn(true);
    setTimeout(() => setShowLoader(false), 1000);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* Loader stays on top during fade-out */}
        {showLoader && (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        )}

        {/* Main App Content cross-fades in */}
        <div
          className={`min-h-screen bg-gradient-to-br from-primary to-primary-dark
            transition-opacity duration-1000
            ${startFadeIn ? "opacity-100" : "opacity-0"}`}
        >
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/fleet" element={<Fleet />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/feedback" element={<Feedback />} />

              {/* Customer Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
