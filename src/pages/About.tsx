import { Link } from "react-router-dom";
import { Car, Users, Award, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const About = () => {
  const values = [
    {
      icon: Car,
      title: "Reliable Service",
      description:
        "We pride ourselves on punctuality and dependable transportation solutions for every journey.",
    },
    {
      icon: Users,
      title: "Customer First",
      description:
        "Your comfort and satisfaction are our top priorities. We go the extra mile to ensure great experiences.",
    },
    {
      icon: Award,
      title: "Quality Fleet",
      description:
        "Our well-maintained vehicles undergo regular safety checks to guarantee your peace of mind.",
    },
    {
      icon: MapPin,
      title: "Local Expertise",
      description:
        "Born and raised in Mhasla, we know every route and can get you anywhere efficiently.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 section-padding bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h1 className="text-responsive-xl font-bold mb-4">About Mhasla Wheels</h1>
          <p className="text-responsive-md mb-6 opacity-90">
            Your trusted transportation partner since 2020
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button asChild variant="book" className="text-lg">
              <Link to="/booking">Book Your Ride</Link>
            </Button>

            <Button asChild variant="blue" className="text-lg">
              <Link to="/fleet">View Fleet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-background text-foreground">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-responsive-lg font-bold mb-2">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020 by local entrepreneurs who understood the transportation
                  challenges in Mhasla, Mhasla Wheels began as a small fleet of three vehicles
                  with a big vision: to revolutionize how people move around our beautiful city.
                </p>
                <p>
                  What started as a solution to help fellow residents get reliable rides has grown
                  into Mhasla's most trusted transportation service. We've served thousands of
                  satisfied customers and expanded our fleet to meet every transportation need.
                </p>
                <p>
                  Today, we're not just a car service – we're part of the Mhasla community,
                  supporting local events, employing local drivers, and contributing to the growth
                  of our city.
                </p>
              </div>
            </div>

            <div className="relative">
              {/* big square (grey) with a yellow circular car icon inside */}
              <div className="aspect-square bg-secondary rounded-2xl flex items-center justify-center">
                <div className="w-28 h-28 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                  <Car size={96} />
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent rounded-full flex items-center justify-center">
                <Users size={28} className="text-accent-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h2 className="text-responsive-lg font-bold mb-4">Our Mission</h2>
          <p className="text-xl leading-relaxed">
            To provide safe, reliable, and comfortable transportation solutions that connect the
            people of Mhasla to their destinations, while contributing to the economic growth and
            social well-being of our community.
          </p>
        </div>
      </section>

      {/* Values (styled like services) */}
      <section className="section-padding bg-background text-foreground">
        <div className="max-w-6xl mx-auto container-padding">
          <h2 className="text-responsive-lg font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="service-card text-center bg-card">
                <div className="mx-auto mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary text-primary-foreground">
                    <value.icon size={20} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-card-foreground">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-secondary-foreground mb-2">10,000+</div>
              <div className="text-primary-foreground/90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-foreground mb-2">50+</div>
              <div className="text-primary-foreground/90">Vehicles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-foreground mb-2">24/7</div>
              <div className="text-primary-foreground/90">Service Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-foreground mb-2">4+</div>
              <div className="text-primary-foreground/90">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
