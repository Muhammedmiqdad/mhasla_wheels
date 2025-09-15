import { Car, Users, Award, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingModal from '@/components/BookingModal';
import { useState } from 'react';

const About = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const values = [
    {
      icon: Car,
      title: "Reliable Service",
      description: "We pride ourselves on punctuality and dependable transportation solutions for every journey."
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Your comfort and satisfaction are our top priorities. We go the extra mile to ensure great experiences."
    },
    {
      icon: Award,
      title: "Quality Fleet",
      description: "Our well-maintained vehicles undergo regular safety checks to guarantee your peace of mind."
    },
    {
      icon: MapPin,
      title: "Local Expertise",
      description: "Born and raised in Mhasla, we know every route and can get you anywhere efficiently."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />
      
      {/* Hero Section */}
      <section className="pt-24 section-padding bg-gradient-subtle">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h1 className="text-responsive-xl font-bold text-foreground mb-6 animate-fade-in-up">
            About Mhasla Wheels
          </h1>
          <p className="text-responsive-md text-muted-foreground animate-fade-in-up">
            Your trusted transportation partner since 2020
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-responsive-lg font-bold text-foreground">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020 by local entrepreneurs who understood the transportation challenges in Mhasla, 
                  Mhasla Wheels began as a small fleet of three vehicles with a big vision: to revolutionize 
                  how people move around our beautiful city.
                </p>
                <p>
                  What started as a solution to help fellow residents get reliable rides has grown into 
                  Mhasla's most trusted transportation service. We've served over 10,000 satisfied customers 
                  and expanded our fleet to meet every transportation need.
                </p>
                <p>
                  Today, we're not just a car service – we're part of the Mhasla community, supporting 
                  local events, employing local drivers, and contributing to the growth of our city.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-primary rounded-2xl flex items-center justify-center">
                <Car size={120} className="text-primary-foreground" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent rounded-full flex items-center justify-center">
                <Users size={32} className="text-accent-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-secondary">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h2 className="text-responsive-lg font-bold text-foreground mb-8">
            Our Mission
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            To provide safe, reliable, and comfortable transportation solutions that connect 
            the people of Mhasla to their destinations, while contributing to the economic 
            growth and social well-being of our community.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <h2 className="text-responsive-lg font-bold text-center text-foreground mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="service-card text-center">
                <div className="service-icon mx-auto">
                  <value.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">10,000+</div>
              <div className="text-primary-foreground/80">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">50+</div>
              <div className="text-primary-foreground/80">Vehicles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <div className="text-primary-foreground/80">Service Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">4+</div>
              <div className="text-primary-foreground/80">Years Experience</div>
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

export default About;