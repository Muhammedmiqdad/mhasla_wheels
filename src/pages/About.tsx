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
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-red-950 text-white">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-b from-red-800 via-red-700/90 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>

        <div className="relative max-w-4xl mx-auto text-center container-padding">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg animate-fade-in-up">
            About <span className="text-red-400">Mhasla Wheels</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 opacity-90 animate-fade-in-up">
            Your trusted transportation partner since 2020 — delivering comfort,
            reliability, and trust on every road.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-in-right">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white text-red-700 font-semibold px-8 py-4 hover:bg-gray-100 transition"
            >
              <Link to="/booking">Book Your Ride</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-black/40 border border-white/30 text-white hover:bg-red-600/20 transition px-8 py-4"
            >
              <Link to="/fleet">View Fleet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-black text-gray-200">
        <div className="max-w-6xl mx-auto container-padding grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Our Story
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Founded in 2020 by passionate locals who understood Mhasla’s transportation challenges,
              Mhasla Wheels began as a humble fleet of just three vehicles — driven by a bold vision:
              to redefine how people move around our vibrant city.
            </p>
            <p className="text-gray-400 leading-relaxed">
              What started as a solution for reliable rides has grown into the city’s
              most trusted mobility brand. With a rapidly growing fleet and thousands of
              satisfied customers, we’ve built more than a business — we’ve built a community.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Today, Mhasla Wheels continues to support local drivers, power events,
              and drive the future of transportation — one ride at a time.
            </p>
          </div>

          {/* Right - Visual */}
          <div className="relative flex justify-center">
            <div className="relative aspect-square w-80 md:w-96 rounded-3xl bg-gradient-to-br from-red-700 to-black flex items-center justify-center shadow-[0_0_40px_rgba(255,0,0,0.3)]">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center bg-white text-red-700 shadow-lg">
                <Car size={80} />
              </div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/40">
                <Users size={28} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-gradient-to-r from-red-800 via-red-700 to-black text-white text-center">
        <div className="max-w-3xl mx-auto container-padding">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed opacity-90">
            To provide safe, reliable, and comfortable transportation solutions
            that connect the people of Mhasla — while empowering our community,
            local economy, and sustainable future.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-black text-white">
        <div className="max-w-6xl mx-auto container-padding">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center bg-gradient-to-b from-red-900/20 to-black rounded-xl p-6 shadow-[0_4px_15px_rgba(255,0,0,0.1)] hover:shadow-[0_0_25px_rgba(255,0,0,0.3)] transition-transform hover:-translate-y-1"
              >
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-red-600/80 text-white rounded-full">
                  <value.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-r from-black via-red-900 to-black text-white text-center">
        <div className="max-w-6xl mx-auto container-padding grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Happy Customers", value: "10,000+" },
            { label: "Vehicles", value: "50+" },
            { label: "Service Available", value: "24/7" },
            { label: "Years Experience", value: "4+" },
          ].map((stat, i) => (
            <div
              key={i}
              className="group p-6 rounded-xl bg-gradient-to-b from-red-800/10 to-black hover:shadow-[0_0_20px_rgba(255,0,0,0.2)] transition"
            >
              <div className="text-4xl font-extrabold text-red-400 mb-2 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
