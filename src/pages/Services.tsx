import { Car, Bike, MapPin, Camera, Clock, Shield, Users, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Services = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const services = [
    {
      icon: Car,
      title: "Car Rentals",
      description: "Comfortable and reliable car rentals for your daily commute, business trips, or family outings.",
      features: ["AC Vehicles", "Experienced Drivers", "Flexible Timing", "Competitive Rates"],
      price: "Starting from ₹500/day"
    },
    {
      icon: Bike,
      title: "Bike Rentals",
      description: "Quick and economical bike rentals perfect for solo trips and navigating through city traffic.",
      features: ["Well-maintained Bikes", "Helmet Included", "Hourly & Daily Rates", "Fuel Efficient"],
      price: "Starting from ₹100/day"
    },
    {
      icon: MapPin,
      title: "Local Rides",
      description: "Point-to-point rides within Mhasla city for your everyday transportation needs.",
      features: ["Door-to-door Service", "Quick Booking", "Fixed Pricing", "GPS Tracking"],
      price: "Starting from ₹50"
    },
    {
      icon: Camera,
      title: "Tourist Packages",
      description: "Curated sightseeing packages to explore Mhasla's attractions and nearby destinations.",
      features: ["Tour Guide Available", "Multiple Destinations", "Photo Stops", "Customizable Routes"],
      price: "Starting from ₹1500/day"
    }
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "Safety First",
      description: "All our vehicles are regularly inspected and drivers are verified"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      description: "Round-the-clock service to meet your transportation needs"
    },
    {
      icon: Users,
      title: "Professional Drivers",
      description: "Experienced and courteous drivers who know Mhasla inside out"
    },
    {
      icon: Star,
      title: "Quality Service",
      description: "Committed to providing excellent service every time"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />
      
      {/* Hero Section */}
      <section className="pt-24 section-padding bg-gradient-subtle">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h1 className="text-responsive-xl font-bold text-foreground mb-6 animate-fade-in-up">
            Our Services
          </h1>
          <p className="text-responsive-md text-muted-foreground animate-fade-in-up">
            Comprehensive transportation solutions for every need
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">
                  <service.icon size={24} />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">
                    {service.price}
                  </span>
                  <Button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="btn-gradient text-primary-foreground px-4 py-2"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-secondary">
        <div className="max-w-6xl mx-auto container-padding">
          <h2 className="text-responsive-lg font-bold text-center text-foreground mb-12">
            Why Choose Mhasla Wheels?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon size={28} className="text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h2 className="text-responsive-lg font-bold mb-6">
            Ready to Book Your Ride?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contact us now to book any of our services or get a custom quote for your transportation needs.
          </p>
          <Button 
            onClick={() => setIsBookingModalOpen(true)}
            className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 py-3 text-lg"
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