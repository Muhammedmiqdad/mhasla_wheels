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

  // 🧠 Fetch Vehicles + Realtime Sync
  useEffect(() => {
    let subscription: any;

    const fetchVehicles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Error fetching vehicles:", error);
      else setVehicles(data || []);
      setLoading(false);
    };

    fetchVehicles();

    // ✅ Realtime subscription
    subscription = supabase
      .channel("public:vehicles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vehicles" },
        (payload) => {
          console.log("🔁 Fleet update:", payload);
          fetchVehicles();
        }
      )
      .subscribe();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  // 🏷️ Dynamic Categories
  const categories = [
    { name: "All", count: vehicles.length },
    { name: "Cars", count: vehicles.filter((v) => v.type === "Car").length },
    { name: "Bikes", count: vehicles.filter((v) => v.type === "Bike").length },
  ];

  // 🚗 Filter vehicles by category
  const filteredVehicles =
    selectedCategory === "All"
      ? vehicles
      : vehicles.filter((v) => v.type === selectedCategory.slice(0, -1));

  return (
    <div className="min-h-screen bg-background">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />

      {/* Hero Section */}
      <section className="pt-24 section-padding bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h1 className="text-responsive-xl font-bold mb-6 animate-fade-in-up">
            Our Fleet
          </h1>
          <p className="text-responsive-md opacity-90 animate-fade-in-up">
            Choose from our diverse range of well-maintained vehicles
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-secondary text-secondary-foreground">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="flex justify-center space-x-4 flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary-dark text-secondary-foreground hover:bg-secondary"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Grid */}
      <section className="section-padding bg-secondary text-secondary-foreground">
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
                  className="fleet-card bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-500"
                >
                  {/* Vehicle Image or Icon */}
                  <div className="h-48 bg-primary text-primary-foreground flex items-center justify-center relative overflow-hidden">
                    {vehicle.image_url ? (
                      <img
                        src={vehicle.image_url}
                        alt={vehicle.name}
                        className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <Car size={80} />
                    )}
                    <div className="absolute top-4 right-4 bg-background/80 text-foreground px-2 py-1 rounded-full text-sm font-medium">
                      {vehicle.type || "Car"}
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{vehicle.name}</h3>
                      <div className="flex items-center">
                        <Star
                          size={16}
                          className="text-yellow-400 fill-current"
                        />
                        <span className="text-sm font-medium ml-1">4.8</span>
                      </div>
                    </div>

                    <p className="opacity-90 text-sm mb-4">
                      {vehicle.description ||
                        "Premium, well-maintained ride for your journey."}
                    </p>

                    <div className="flex items-center mb-4">
                      <Users size={16} className="mr-2" />
                      <span className="text-sm">
                        {vehicle.capacity
                          ? `${vehicle.capacity} Passengers`
                          : "Varies"}
                      </span>
                    </div>

                    {/* Dynamic Feature Tags */}
                    {vehicle.type && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {vehicle.type}
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          AC
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          GPS
                        </span>
                      </div>
                    )}

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        {vehicle.per_km_rate
                          ? `₹${vehicle.per_km_rate}/km`
                          : vehicle.base_rate
                          ? `₹${vehicle.base_rate}`
                          : "₹ —"}
                      </span>
                      <Button asChild variant="book" size="sm">
                        <a href="/booking">Book Now</a>
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
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto container-padding">
          <h2 className="text-responsive-lg font-bold text-center mb-12">
            Fleet Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-primary-foreground text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Car size={32} />
              </div>
              <div className="text-3xl font-bold">{vehicles.length}+</div>
              <div className="opacity-90">Total Vehicles</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary-foreground text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield size={32} />
              </div>
              <div className="text-3xl font-bold">100%</div>
              <div className="opacity-90">Safety Certified</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary-foreground text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Fuel size={32} />
              </div>
              <div className="text-3xl font-bold">25+</div>
              <div className="opacity-90">Avg. Fuel Efficiency</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary-foreground text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Star size={32} />
              </div>
              <div className="text-3xl font-bold">4.8</div>
              <div className="opacity-90">Average Rating</div>
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
