// src/pages/Index.tsx
import { useState } from "react";
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
  Phone,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);

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

  const fleetPreview = [
    {
      name: "Sedan Premium",
      description: "Perfect for business trips and comfortable city rides",
      rating: 4.8,
      price: "₹12/km",
    },
    {
      name: "SUV Deluxe",
      description: "Ideal for family trips and group travel",
      rating: 4.9,
      price: "₹18/km",
    },
    {
      name: "Sports Bike",
      description: "Fast and efficient for solo or couple rides",
      rating: 4.6,
      price: "₹5/km",
    },
  ];

  const features = [
    { icon: Shield, title: "Safety First", description: "All vehicles inspected & drivers verified" },
    { icon: Clock, title: "24/7 Service", description: "Available round the clock" },
    { icon: Users, title: "Professional Drivers", description: "Experienced & courteous" },
    { icon: Star, title: "Top Rated", description: "4.8+ customer rating" },
  ];

  if (showLoading) {
    return <LoadingScreen onLoadingComplete={() => setShowLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="hero-section bg-primary text-primary-foreground relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="hero-content">
          <div className="floating-element">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 bg-secondary text-secondary-foreground">
              <Car size={40} />
            </div>
          </div>

          <h1 className="text-responsive-xl font-bold mb-6 animate-fade-in-up">
            Your Ride, Your Way in Mhasla
          </h1>

          <p className="text-responsive-md mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in-up">
            Experience reliable, comfortable, and affordable transportation solutions tailored for the people of Mhasla
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center animate-slide-in-right">
            <Button asChild variant="book" size="lg">
              <Link to="/booking">Book Your Ride</Link>
            </Button>

            <Button asChild variant="blue" size="lg">
              <Link to="/fleet" className="flex items-center">
                Explore Our Fleet <ArrowRight size={20} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold mb-4">Our Services</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Comprehensive transportation solutions for every need and occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="service-card group bg-secondary text-secondary-foreground border border-border">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-primary text-primary-foreground">
                  <service.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="opacity-90">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold mb-4">Our Fleet Preview</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">Choose from our diverse range of well-maintained vehicles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {fleetPreview.map((vehicle, index) => (
              <div key={index} className="fleet-card bg-secondary text-secondary-foreground border border-border">
                <div className="h-48 rounded-t-xl flex items-center justify-center bg-primary text-primary-foreground">
                  <Car size={80} />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{vehicle.name}</h3>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{vehicle.rating}</span>
                    </div>
                  </div>

                  <p className="opacity-90 mb-4">{vehicle.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{vehicle.price}</span>

                    <Button asChild variant="book" size="sm">
                      <Link to="/booking">Book Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-responsive-lg font-bold mb-4">Why Choose Mhasla Wheels?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">We're committed to providing the best transportation experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-primary text-primary-foreground">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h2 className="text-responsive-lg font-bold mb-6">Ready to Book Your Ride?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust Mhasla Wheels for their transportation needs.
          </p>

          <div className="flex flex-col gap-4 md:flex-row md:justify-center">
            {/* Book Ride */}
            <Button asChild size="lg" className="w-full md:w-auto bg-red-600 hover:bg-red-700 rounded-full shadow-md">
              <Link to="/booking">Book Your Ride</Link>
            </Button>

            {/* Call Now */}
            <a href="tel:+96541103254" className="w-full md:w-auto">
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md flex items-center justify-center"
              >
                <Phone size={20} className="mr-2" /> Call Now
              </Button>
            </a>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/96541103254?text=Hi! I'm interested in booking a ride with Mhasla Wheels."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto"
            >
              <Button
                size="lg"
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full shadow-md flex items-center justify-center"
              >
                <MessageCircle size={20} className="mr-2" /> WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp Button (desktop only) */}
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
