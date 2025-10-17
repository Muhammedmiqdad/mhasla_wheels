// src/pages/Fleet.tsx
import { Car, Users, Fuel, Shield, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";

const Fleet = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [liveUpdating, setLiveUpdating] = useState(false);

  // Fetch all vehicles
  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) console.error("❌ Error fetching vehicles:", error);
    else setVehicles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();

    // ✅ Realtime updates (requires Realtime enabled on table)
    const channel = supabase
      .channel("realtime:vehicles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehicles" },
        (payload) => {
          console.log("🔁 Realtime fleet update:", payload);
          setLiveUpdating(true);
          fetchVehicles();
          setTimeout(() => setLiveUpdating(false), 1200);
        }
      )
      .subscribe();

    // ✅ Refresh when user switches back to the tab
    const handleFocus = () => {
      console.log("👀 Tab focused — refreshing vehicles");
      fetchVehicles();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      supabase.removeChannel(channel);
    };
  }, []);

  const categories = [
    { name: "All", count: vehicles.length },
    { name: "Cars", count: vehicles.filter((v) => v.type === "Car").length },
    { name: "Bikes", count: vehicles.filter((v) => v.type === "Bike").length },
  ];

  const filteredVehicles =
    selectedCategory === "All"
      ? vehicles
      : vehicles.filter((v) => v.type === selectedCategory.slice(0, -1));

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-20 bg-[#1a1a1a] text-center border-b border-red-800/20 relative">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Our <span className="text-red-500">Fleet</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 opacity-90 max-w-3xl mx-auto">
            Choose from our diverse range of well-maintained vehicles.
          </p>
          {liveUpdating && (
            <div className="absolute top-6 right-6 text-xs bg-red-600/20 border border-red-600 px-3 py-1 rounded-full text-red-300 animate-pulse">
              Live Updating...
            </div>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-[#181818] border-b border-red-800/20">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="flex justify-center flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-red-600 text-white shadow-[0_0_10px_rgba(255,0,0,0.4)]"
                    : "bg-[#1f1f1f] text-gray-300 hover:bg-[#2a2a2a]"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Grid */}
      <section className="section-padding bg-[#181818] text-gray-200">
        <div className="max-w-6xl mx-auto container-padding">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading vehicles...</p>
          ) : filteredVehicles.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              No vehicles available in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle, index) => (
                <div
                  key={vehicle.id || index}
                  className="bg-[#1e1e1e] border border-red-800/30 rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(255,0,0,0.25)] hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="h-48 bg-[#2a2a2a] flex items-center justify-center relative overflow-hidden">
                    {vehicle.image_url ? (
                      <img
                        src={vehicle.image_url}
                        alt={vehicle.name}
                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <Car size={80} className="text-red-600" />
                    )}
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {vehicle.type || "Car"}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{vehicle.name}</h3>
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm ml-1">4.8</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">
                      {vehicle.description ||
                        "Premium, well-maintained ride for your journey."}
                    </p>

                    <div className="flex items-center mb-4 text-gray-400 text-sm">
                      <Users size={16} className="mr-2" />
                      {vehicle.capacity
                        ? `${vehicle.capacity} Passengers`
                        : "Varies"}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded-full">
                        {vehicle.type}
                      </span>
                      <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded-full">
                        AC
                      </span>
                      <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs rounded-full">
                        GPS
                      </span>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between border-t border-red-800/20 pt-4">
                      <span className="text-lg font-semibold text-red-400">
                        {vehicle.per_km_rate
                          ? `₹${vehicle.per_km_rate}/km`
                          : vehicle.base_rate
                          ? `₹${vehicle.base_rate}`
                          : "₹ —"}
                      </span>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full px-5"
                        onClick={() => setIsBookingModalOpen(true)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fleet Stats */}
      <section className="section-padding bg-[#141414] text-white border-t border-red-800/10">
        <div className="max-w-6xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Fleet <span className="text-red-500">Statistics</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="w-16 h-16 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Car size={28} />
              </div>
              <div className="text-3xl font-bold">{vehicles.length}+</div>
              <div className="text-gray-400 text-sm">Total Vehicles</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield size={28} />
              </div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-gray-400 text-sm">Safety Certified</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Fuel size={28} />
              </div>
              <div className="text-3xl font-bold">25+</div>
              <div className="text-gray-400 text-sm">Avg. Fuel Efficiency</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star size={28} />
              </div>
              <div className="text-3xl font-bold">4.8</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default Fleet;
