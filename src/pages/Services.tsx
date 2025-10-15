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
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-red-950 text-white">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 bg-gradient-to-b from-red-800 via-red-700/90 to-black text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.08)_0%,transparent_80%)]"></div>
        <div className="relative z-10 max-w-4xl mx-auto container-padding">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg animate-fade-in-up">
            Our <span className="text-red-400">Services</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 animate-fade-in-up mb-8 text-gray-200">
            Premium transportation solutions — crafted for comfort, safety, and style.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-black text-gray-200">
        <div className="max-w-6xl mx-auto container-padding grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative group bg-gradient-to-b from-red-900/10 to-black p-8 rounded-2xl border border-red-700/30 shadow-[0_0_25px_rgba(255,0,0,0.15)] hover:shadow-[0_0_40px_rgba(255,0,0,0.35)] transition-all duration-500"
            >
              <div className="w-14 h-14 bg-red-600 text-white rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
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
                  <li key={idx} className="flex items-center text-sm text-gray-400">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-4 border-t border-red-700/20">
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

              {/* Red glow hover effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/30 via-red-400/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl blur-lg transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gradient-to-r from-red-900 via-black to-red-950 text-white">
        <div className="max-w-6xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Why Choose <span className="text-red-400">Mhasla Wheels?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="group bg-gradient-to-b from-black/60 to-red-950/30 p-8 rounded-xl shadow-[0_0_15px_rgba(255,0,0,0.1)] hover:shadow-[0_0_25px_rgba(255,0,0,0.3)] transition-transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(255,0,0,0.3)] group-hover:scale-110 transition-transform">
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
      <section className="relative section-padding bg-gradient-to-b from-red-700 via-red-800 to-black text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,rgba(0,0,0,0.4)_0%,transparent_70%)]"></div>
        <div className="relative z-10 max-w-3xl mx-auto container-padding">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Ready to <span className="text-red-300">Book Your Ride?</span>
          </h2>
          <p className="text-lg mb-10 text-gray-200 opacity-90">
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
