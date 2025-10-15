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

  // 🧠 Fetch & Real-time Sync Fleet
  useEffect(() => {
    let subscription: any;

    const fetchFleet = async () => {
      setLoadingFleet(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("availability", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) console.error("Error fetching fleet:", error);
      else setFleet(data || []);
      setLoadingFleet(false);
    };

    fetchFleet();

    // ✅ Real-time sync with Supabase
    subscription = supabase
      .channel("public:vehicles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehicles" },
        (payload) => {
          console.log("🔁 Realtime fleet update:", payload);
          fetchFleet();
        }
      )
      .subscribe();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  const services = [
    {
      icon: Car,
      title: "Car Rentals",
      description:
        "Comfortable and reliable car rentals for your daily commute, business trips, or family outings.",
    },
    {
      icon: Bike,
      title: "Bike Rentals",
      description:
        "Quick and economical bike rentals perfect for solo trips and navigating through city traffic.",
    },
    {
      icon: MapPin,
      title: "Local Rides",
      description:
        "Point-to-point rides within Mhasla city for your everyday transportation needs.",
    },
    {
      icon: Camera,
      title: "Tourist Packages",
      description:
        "Curated sightseeing packages to explore Mhasla's attractions and nearby destinations.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Safety First",
      description: "All vehicles inspected & drivers verified",
    },
    {
      icon: Clock,
      title: "24/7 Service",
      description: "Available round the clock",
    },
    {
      icon: Users,
      title: "Professional Drivers",
      description: "Experienced & courteous",
    },
    { icon: Star, title: "Top Rated", description: "4.8+ customer rating" },
  ];

  if (showLoading) {
    return <LoadingScreen onLoadingComplete={() => setShowLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#1A0000] to-[#330000] text-white">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="relative mb-10 animate-float">
            <div className="absolute inset-0 w-32 h-32 rounded-full bg-red-500/20 blur-3xl animate-pulse-glow" />
            <div className="relative w-20 h-20 rounded-full flex items-center justify-center bg-white/10 text-red-400 shadow-lg backdrop-blur-md">
              <Car size={48} className="animate-float-delayed" />
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up drop-shadow-lg">
            Your Ride, Your Way in Mhasla
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-fade-in-up">
            Experience reliable, comfortable, and affordable transportation
            solutions tailored for the people of Mhasla.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up">
            <Button
              asChild
              size="lg"
              variant="primary"
              className="rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-700/30 transition"
            >
              <Link to="/booking">Book Your Ride</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full bg-white text-black hover:bg-gray-200 shadow-md"
            >
              <Link to="/fleet" className="flex items-center">
                Explore Our Fleet <ArrowRight size={20} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-red-600/10 to-transparent" />
      </section>

      {/* Services Section */}
      <section className="section-padding relative bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#1A1A1A] to-black" />
        <div className="relative max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold mb-4 text-white animate-fade-in-up">
              Our Services
            </h2>
            <p className="text-xl text-gray-300 opacity-90 max-w-2xl mx-auto animate-fade-in-up">
              Comprehensive transportation solutions for every need and occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-card border border-border rounded-2xl p-8 text-center shadow-card hover:shadow-floating transition-all duration-500 hover:-translate-y-2 animate-fadeIn"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="relative w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg group-hover:scale-110 transition-transform animate-float">
                  <service.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {service.title}
                </h3>
                <p className="text-gray-300 opacity-90 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section (Realtime) */}
      <section className="section-padding relative bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0d0d0d]" />
        <div className="relative max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold mb-4 text-white animate-fade-in-up">
              Our Fleet Preview
            </h2>
            <p className="text-xl text-gray-300 opacity-90 max-w-2xl mx-auto animate-fade-in-up">
              Choose from our diverse range of well-maintained vehicles
            </p>
          </div>

          {loadingFleet ? (
            <p className="text-center text-gray-400">Loading fleet...</p>
          ) : fleet.length === 0 ? (
            <p className="text-center text-gray-400">
              🚗 No vehicles available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fleet.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className="relative group overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-floating transition-all duration-700 hover:-translate-y-2 animate-fadeIn"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="relative h-56 flex items-center justify-center bg-gradient-to-b from-red-600/20 via-black to-black text-primary-foreground">
                    {vehicle.image_url ? (
                      <img
                        src={vehicle.image_url}
                        alt={vehicle.name}
                        className="object-cover w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <Car
                        size={80}
                        className="text-red-500 opacity-80 transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                  </div>

                  <div className="relative p-6 text-center">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white">
                        {vehicle.name}
                      </h3>
                      <div className="flex items-center text-yellow-400">
                        <Star size={16} className="fill-current" />
                        <span className="text-sm font-medium ml-1">4.8</span>
                      </div>
                    </div>
                    <p className="text-gray-300 opacity-90 mb-5 text-sm leading-relaxed">
                      {vehicle.type || "Premium vehicle for any ride"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">
                        {vehicle.per_km_rate
                          ? `₹${vehicle.per_km_rate}/km`
                          : vehicle.base_rate
                          ? `₹${vehicle.base_rate}`
                          : "₹ —"}
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="rounded-full bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-red-700/30 transition-all"
                      >
                        <Link to="/booking">Book Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative section-padding bg-gradient-to-b from-[#0d0d0d] via-[#1a1a1a] to-black text-white overflow-hidden">
        <div className="relative max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold mb-4 animate-fade-in-up">
              Why Choose Mhasla Wheels?
            </h2>
            <p className="text-xl text-gray-300 opacity-90 max-w-2xl mx-auto animate-fade-in-up">
              We're committed to providing you with safe, comfortable, and
              premium transportation every time you ride with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative text-center bg-card rounded-2xl p-8 border border-border shadow-card transition-all duration-700 hover:-translate-y-2 hover:shadow-floating animate-fadeIn"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg transition-transform duration-700 group-hover:scale-110 group-hover:shadow-red-600/40">
                  <feature.icon size={32} className="animate-pulse-slow" />
                </div>
                <h3 className="text-lg font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed opacity-90">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative section-padding bg-gradient-to-br from-red-700 via-red-600 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.6)_100%)] opacity-40" />
        <div className="relative max-w-4xl mx-auto text-center container-padding">
          <h2 className="text-responsive-lg font-bold mb-6 animate-fade-in-up drop-shadow-lg">
            Ready to Book Your Ride?
          </h2>
          <p className="text-lg md:text-xl mb-10 text-gray-100 max-w-2xl mx-auto leading-relaxed opacity-90 animate-fade-in-up">
            Join thousands of happy travelers who trust{" "}
            <span className="font-semibold text-white">Mhasla Wheels</span> for
            safe, stylish, and comfortable journeys — day or night.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-slide-in-right">
            <Button
              asChild
              size="lg"
              className="w-full md:w-auto rounded-full bg-white text-red-700 font-bold text-lg px-10 py-5 shadow-lg hover:shadow-red-500/40 hover:-translate-y-1 transition-all duration-500"
            >
              <Link to="/booking" className="flex items-center gap-2">
                🚗 Book Your Ride
              </Link>
            </Button>
            <a
              href="https://wa.me/96541103254?text=Hi! I'm interested in booking a ride with Mhasla Wheels."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto"
            >
              <Button
                size="lg"
                className="w-full md:w-auto rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold text-lg px-10 py-5 shadow-lg hover:shadow-green-600/30 transition-all duration-500"
              >
                💬 WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/96541103254?text=Hi! I need customer support from Mhasla Wheels."
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
