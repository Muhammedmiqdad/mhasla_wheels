// src/pages/Index.tsx
import { useEffect, useState } from "react";
import {
  Car,
  Bike,
  MapPin,
  Camera,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Users,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { supabase } from "@/supabaseClient";

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [fleet, setFleet] = useState<any[]>([]);
  const [loadingFleet, setLoadingFleet] = useState(true);
  const [liveUpdating, setLiveUpdating] = useState(false);

  // ✅ Fetch fleet from Supabase
  const fetchFleet = async () => {
    setLoadingFleet(true);
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("availability", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) console.error("❌ Error fetching fleet:", error);
    else setFleet(data || []);
    setLoadingFleet(false);
  };

  useEffect(() => {
    fetchFleet();

    // ✅ Realtime updates (requires Realtime enabled on Supabase table)
    const channel = supabase
      .channel("realtime:vehicles-home")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehicles" },
        (payload) => {
          console.log("🔁 Home page realtime update:", payload);
          setLiveUpdating(true);
          fetchFleet();
          setTimeout(() => setLiveUpdating(false), 1200);
        }
      )
      .subscribe();

    // ✅ Also refresh when user switches back to the tab
    const handleFocus = () => {
      console.log("👀 Tab focused — refreshing fleet preview");
      fetchFleet();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      supabase.removeChannel(channel);
    };
  }, []);

  const services = [
    {
      icon: Car,
      title: "Car Rentals",
      description:
        "Comfortable and reliable car rentals for daily commute or business trips.",
    },
    {
      icon: Bike,
      title: "Bike Rentals",
      description:
        "Economical rides for solo travelers navigating city traffic.",
    },
    {
      icon: MapPin,
      title: "Local Rides",
      description: "Point-to-point rides within Mhasla city.",
    },
    {
      icon: Camera,
      title: "Tourist Packages",
      description:
        "Curated sightseeing tours across Mhasla and nearby destinations.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Verified drivers & inspected vehicles",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Always ready when you are",
    },
    {
      icon: Users,
      title: "Professional Drivers",
      description: "Experienced and courteous staff",
    },
    {
      icon: Star,
      title: "Top Rated",
      description: "4.8+ customer satisfaction",
    },
  ];

  if (showLoading) {
    return <LoadingScreen onLoadingComplete={() => setShowLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center bg-[#181818] pt-24 md:pt-32 border-b border-red-800/20 overflow-hidden">
        <div className="relative mb-12">
          {/* Inner Glow Layer */}
          <div className="absolute inset-0 w-64 h-64 rounded-full bg-red-600/25 blur-3xl animate-pulse-glow" />

          {/* Infused Logo Circle */}
          <div
            className="relative w-44 h-44 rounded-full flex items-center justify-center 
            bg-[#0a0a0a] border border-red-600/40 shadow-[0_0_60px_rgba(255,0,0,0.3)]
            overflow-hidden animate-float"
          >
            <div className="absolute inset-0 rounded-full bg-red-600/10 blur-md animate-pulse-soft" />
            <img
              src="/splash-logo.png" // ✅ your logo
              alt="Mhasla Wheels Logo"
              className="w-40 h-40 object-cover rounded-full relative z-10"
            />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Your Ride, Your Way in <span className="text-red-500">Mhasla</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Reliable, comfortable, and affordable transportation tailored for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="rounded-full bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-3"
          >
            <Link to="/booking">Book Your Ride</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            className="rounded-full bg-white text-black hover:bg-gray-200 text-lg px-8 py-3"
          >
            <Link to="/fleet" className="flex items-center">
              Explore Our Fleet <ArrowRight size={20} className="ml-2" />
            </Link>
          </Button>
        </div>

        {liveUpdating && (
          <div className="absolute top-6 right-6 text-xs bg-red-600/20 border border-red-600 px-3 py-1 rounded-full text-red-300 animate-pulse">
            Live Updating...
          </div>
        )}
      </section>

      {/* SERVICES */}
      <section className="section-padding bg-[#181818] border-b border-red-800/10">
        <div className="max-w-6xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Comprehensive transportation solutions for every need and occasion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-[#1f1f1f] border border-red-800/30 rounded-xl p-8 hover:shadow-[0_0_25px_rgba(255,0,0,0.2)] transition-transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center bg-red-600 text-white rounded-full">
                  <service.icon size={26} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET PREVIEW */}
      <section className="section-padding bg-[#141414] border-b border-red-800/10">
        <div className="max-w-6xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fleet Preview</h2>
          <p className="text-gray-400 mb-12">
            Choose from our range of premium, well-maintained vehicles.
          </p>

          {loadingFleet ? (
            <p className="text-gray-500">Loading fleet...</p>
          ) : fleet.length === 0 ? (
            <p className="text-gray-500">
              No vehicles available at the moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fleet.map((vehicle, i) => (
                <div
                  key={vehicle.id || i}
                  className="bg-[#1e1e1e] border border-red-800/30 rounded-xl overflow-hidden hover:shadow-[0_0_25px_rgba(255,0,0,0.25)] hover:-translate-y-1 transition-all"
                >
                  <div className="h-48 relative bg-[#2a2a2a] flex items-center justify-center">
                    {vehicle.image_url ? (
                      <img
                        src={vehicle.image_url}
                        alt={vehicle.name}
                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform"
                      />
                    ) : (
                      <Car size={64} className="text-red-500" />
                    )}
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {vehicle.type || "Car"}
                    </div>
                  </div>

                  <div className="p-6 text-left">
                    <h3 className="text-xl font-semibold mb-1">
                      {vehicle.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {vehicle.type || "Comfortable and reliable ride."}
                    </p>
                    <div className="flex justify-between items-center border-t border-red-800/20 pt-3">
                      <span className="text-red-400 font-semibold">
                        {vehicle.per_km_rate
                          ? `₹${vehicle.per_km_rate}/km`
                          : vehicle.base_rate
                          ? `₹${vehicle.base_rate}`
                          : "₹ —"}
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full px-4"
                      >
                        <Link to="/booking">Book</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-padding bg-[#181818]">
        <div className="max-w-6xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Choose <span className="text-red-500">Mhasla Wheels?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#1e1e1e] border border-red-800/30 rounded-xl p-8 hover:shadow-[0_0_25px_rgba(255,0,0,0.25)] transition-transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-600 text-white rounded-full">
                  <f.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-[#141414] border-t border-red-800/20 text-center">
        <div className="max-w-4xl mx-auto container-padding">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to <span className="text-red-500">Book Your Ride?</span>
          </h2>
          <p className="text-gray-400 mb-10">
            Join thousands of happy customers who trust Mhasla Wheels for every
            ride.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="rounded-full bg-red-600 hover:bg-red-700 text-white text-lg px-10 py-4"
            >
              <Link to="/booking">🚗 Book Your Ride</Link>
            </Button>
            <a
              href="https://wa.me/96541103254?text=Hi! I'm interested in booking a ride with Mhasla Wheels."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto"
            >
              <Button className="rounded-full bg-green-500 hover:bg-green-600 text-white text-lg px-10 py-4">
                💬 WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/96541103254?text=Hi! I need support from Mhasla Wheels."
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 items-center justify-center transition-transform hover:scale-110"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default Index;
