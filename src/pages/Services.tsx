// src/pages/Services.tsx
import {
  Car,
  Bike,
  MapPin,
  Camera,
  Clock,
  Shield,
  Users,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import { Helmet } from "react-helmet"; // ✅ Added for meta tags

const Services = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // ✅ Metadata state
  const [meta, setMeta] = useState<any>(null);

  // ✅ Fetch metadata for "services" page
  const fetchMeta = async () => {
    try {
      const { data, error } = await supabase
        .from("metadata")
        .select("*")
        .eq("page_name", "services")
        .single();
      if (error) throw error;
      setMeta(data);
    } catch (err) {
      console.error("❌ Error fetching metadata for Services page:", err);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  const services = [
    {
      icon: Car,
      title: "Car Rentals",
      description:
        "Comfortable and reliable car rentals for your daily commute, business trips, or family outings.",
      features: [
        "AC Vehicles",
        "Experienced Drivers",
        "Flexible Timing",
        "Competitive Rates",
      ],
      price: "Starting from ₹500/day",
    },
    {
      icon: Bike,
      title: "Bike Rentals",
      description:
        "Quick and economical bike rentals perfect for solo trips and navigating through city traffic.",
      features: [
        "Well-maintained Bikes",
        "Helmet Included",
        "Hourly & Daily Rates",
        "Fuel Efficient",
      ],
      price: "Starting from ₹100/day",
    },
    {
      icon: MapPin,
      title: "Local Rides",
      description:
        "Point-to-point rides within Mhasla city for your everyday transportation needs.",
      features: [
        "Door-to-door Service",
        "Quick Booking",
        "Fixed Pricing",
        "GPS Tracking",
      ],
      price: "Starting from ₹50",
    },
    {
      icon: Camera,
      title: "Tourist Packages",
      description:
        "Curated sightseeing packages to explore Mhasla's attractions and nearby destinations.",
      features: [
        "Tour Guide Available",
        "Multiple Destinations",
        "Photo Stops",
        "Customizable Routes",
      ],
      price: "Starting from ₹1500/day",
    },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "All vehicles are regularly inspected, and our drivers are fully verified for your safety.",
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description:
        "Round-the-clock availability to ensure you can ride anytime, anywhere.",
    },
    {
      icon: Users,
      title: "Professional Drivers",
      description:
        "Experienced, courteous, and knowledgeable about every route in Mhasla.",
    },
    {
      icon: Star,
      title: "Top-Rated Service",
      description:
        "Trusted by thousands of happy customers who love our quality and reliability.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* ✅ Dynamic Meta Tags */}
      {meta && (
        <Helmet>
          <title>{meta.site_title || "Our Services - Mhasla Wheels"}</title>
          <meta
            name="description"
            content={
              meta.site_description ||
              "Explore our range of premium car, bike, and travel services in Mhasla."
            }
          />
          <meta
            name="keywords"
            content={
              meta.meta_keywords ||
              "car rental, bike rental, mhasla cab, services, tours"
            }
          />
          <meta
            property="og:title"
            content={meta.site_title || "Mhasla Wheels Services"}
          />
          <meta
            property="og:description"
            content={
              meta.site_description ||
              "Premium transportation and travel packages from Mhasla Wheels."
            }
          />
          <meta property="og:image" content={meta.og_image_url || "/splash-logo.png"} />
          <meta property="og:type" content="website" />
        </Helmet>
      )}

      <Header onBookRide={() => setIsBookingModalOpen(true)} />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-20 bg-[#1a1a1a] text-center border-b border-red-800/20">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Our <span className="text-red-500">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 opacity-90 max-w-3xl mx-auto">
            Premium transportation solutions — crafted for comfort, safety, and
            style.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-[#181818] text-gray-200">
        <div className="max-w-6xl mx-auto container-padding grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-[#1e1e1e] border border-red-800/30 p-8 rounded-2xl shadow-[0_0_20px_rgba(255,0,0,0.1)] hover:shadow-[0_0_25px_rgba(255,0,0,0.3)] transition-all duration-300"
            >
              <div className="w-14 h-14 bg-red-600 text-white rounded-xl flex items-center justify-center mb-5">
                <service.icon size={28} />
              </div>

              <h3 className="text-2xl font-bold mb-3 text-white">
                {service.title}
              </h3>
              <p className="text-gray-400 mb-5 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-gray-400"
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-red-800/20">
                <span className="text-lg font-semibold text-red-400">
                  {service.price}
                </span>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full px-5 transition"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-[#141414] border-t border-red-800/10 border-b border-red-800/10">
        <div className="max-w-6xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Why Choose <span className="text-red-500">Mhasla Wheels?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-[#1f1f1f] border border-red-800/30 p-8 rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(255,0,0,0.25)] transition-transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-5 text-white">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#1a1a1a] text-center">
        <div className="max-w-3xl mx-auto container-padding">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to <span className="text-red-400">Book Your Ride?</span>
          </h2>
          <p className="text-lg mb-10 text-gray-300 opacity-90">
            Contact us now to schedule your trip or get a custom quote.
          </p>
          <Button
            size="lg"
            className="bg-white text-red-700 font-semibold px-10 py-4 rounded-full hover:bg-gray-100 transition-transform hover:scale-105"
            onClick={() => setIsBookingModalOpen(true)}
          >
            Get Started
          </Button>
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

export default Services;
