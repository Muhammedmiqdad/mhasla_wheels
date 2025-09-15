import { Car, Users, Fuel, Shield, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Fleet = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const vehicles = [
    {
      name: "Sedan Premium",
      type: "Car",
      capacity: "4 Passengers",
      features: ["AC", "GPS", "Music System", "Comfortable Seating"],
      price: "₹12/km",
      rating: 4.8,
      image: "sedan",
      description: "Perfect for business trips and comfortable city rides"
    },
    {
      name: "SUV Deluxe", 
      type: "Car",
      capacity: "7 Passengers",
      features: ["AC", "GPS", "Extra Space", "Premium Interior"],
      price: "₹18/km",
      rating: 4.9,
      image: "suv",
      description: "Ideal for family trips and group travel"
    },
    {
      name: "Hatchback Economy",
      type: "Car", 
      capacity: "4 Passengers",
      features: ["AC", "GPS", "Fuel Efficient", "Easy Parking"],
      price: "₹10/km",
      rating: 4.7,
      image: "hatchback",
      description: "Budget-friendly option for daily commutes"
    },
    {
      name: "Sports Bike",
      type: "Bike",
      capacity: "2 Passengers", 
      features: ["Helmet", "Storage Box", "High Mileage", "Quick Navigation"],
      price: "₹5/km",
      rating: 4.6,
      image: "bike-sports",
      description: "Fast and efficient for solo or couple rides"
    },
    {
      name: "Scooter Classic",
      type: "Bike",
      capacity: "2 Passengers",
      features: ["Helmet", "Under-seat Storage", "Easy Handling", "Eco-friendly"],
      price: "₹4/km", 
      rating: 4.5,
      image: "scooter",
      description: "Perfect for short distance city travel"
    },
    {
      name: "Luxury Sedan",
      type: "Car",
      capacity: "4 Passengers",
      features: ["Premium AC", "Leather Seats", "Entertainment System", "WiFi"],
      price: "₹25/km",
      rating: 5.0,
      image: "luxury-sedan", 
      description: "Premium experience for special occasions"
    }
  ];

  const categories = [
    { name: "All", count: vehicles.length },
    { name: "Cars", count: vehicles.filter(v => v.type === "Car").length },
    { name: "Bikes", count: vehicles.filter(v => v.type === "Bike").length }
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVehicles = selectedCategory === "All" 
    ? vehicles 
    : vehicles.filter(v => v.type === selectedCategory.slice(0, -1));

  return (
    <div className="min-h-screen bg-background">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />
      
      {/* Hero Section */}
      <section className="pt-24 section-padding bg-gradient-subtle">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h1 className="text-responsive-xl font-bold text-foreground mb-6 animate-fade-in-up">
            Our Fleet
          </h1>
          <p className="text-responsive-md text-muted-foreground animate-fade-in-up">
            Choose from our diverse range of well-maintained vehicles
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="flex justify-center space-x-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.name
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary-dark'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Grid */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, index) => (
              <div key={index} className="fleet-card">
                {/* Vehicle Image Placeholder */}
                <div className="h-48 bg-gradient-primary rounded-t-xl flex items-center justify-center relative overflow-hidden">
                  <Car size={80} className="text-primary-foreground" />
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-medium">
                    {vehicle.type}
                  </div>
                </div>
                
                {/* Vehicle Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-card-foreground">
                      {vehicle.name}
                    </h3>
                    <div className="flex items-center">
                      <Star size={16} className="text-accent fill-current" />
                      <span className="text-sm font-medium ml-1">{vehicle.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">
                    {vehicle.description}
                  </p>
                  
                  <div className="flex items-center text-muted-foreground mb-4">
                    <Users size={16} className="mr-2" />
                    <span className="text-sm">{vehicle.capacity}</span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {vehicle.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {vehicle.price}
                    </span>
                    <Button 
                      onClick={() => setIsBookingModalOpen(true)}
                      className="btn-gradient text-primary-foreground px-4 py-2"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Stats */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto container-padding">
          <h2 className="text-responsive-lg font-bold text-center mb-12">
            Fleet Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <Car size={32} className="text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-accent">50+</div>
              <div className="text-primary-foreground/80">Total Vehicles</div>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <Shield size={32} className="text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-accent">100%</div>
              <div className="text-primary-foreground/80">Safety Certified</div>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <Fuel size={32} className="text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-accent">25+</div>
              <div className="text-primary-foreground/80">Avg. Fuel Efficiency</div>
            </div>
            <div className="space-y-2">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
                <Star size={32} className="text-accent-foreground" />
              </div>
              <div className="text-3xl font-bold text-accent">4.8</div>
              <div className="text-primary-foreground/80">Average Rating</div>
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