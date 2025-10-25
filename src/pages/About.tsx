// src/pages/About.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Car, Users, Award, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import { Helmet } from "react-helmet"; // ✅ added

const About = () => {
  const [meta, setMeta] = useState<any>(null); // ✅ metadata state

  // ✅ Fetch metadata for "about" page
  const fetchMeta = async () => {
    try {
      const { data, error } = await supabase
        .from("metadata")
        .select("*")
        .eq("page_name", "about")
        .single();
      if (error) throw error;
      setMeta(data);
    } catch (err) {
      console.error("❌ Error fetching metadata for About page:", err);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

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
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* ✅ Dynamic Meta Tags */}
      {meta && (
        <Helmet>
          <title>{meta.site_title || "About - Mhasla Wheels"}</title>
          <meta
            name="description"
            content={
              meta.site_description ||
              "Learn about Mhasla Wheels — your trusted transportation partner in Mhasla."
            }
          />
          <meta
            name="keywords"
            content={
              meta.meta_keywords ||
              "about mhasla wheels, mhasla transport, car rentals mhasla"
            }
          />
          <meta property="og:title" content={meta.site_title || "About Mhasla Wheels"} />
          <meta
            property="og:description"
            content={
              meta.site_description ||
              "Discover the story, mission, and values behind Mhasla Wheels."
            }
          />
          <meta property="og:image" content={meta.og_image_url || "/splash-logo.png"} />
          <meta property="og:type" content="website" />
        </Helmet>
      )}

      <Header />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-20 bg-[#1a1a1a] text-center border-b border-red-800/20">
        <div className="max-w-4xl mx-auto container-padding">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            About <span className="text-red-500">Mhasla Wheels</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 opacity-90 max-w-3xl mx-auto">
            Your trusted transportation partner since 2020 — delivering comfort,
            reliability, and trust on every road.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
            <Button
              asChild
              variant="book"
              className="rounded-full px-8 py-3 text-lg"
            >
              <Link to="/booking">Book Your Ride</Link>
            </Button>
            <Button
              asChild
              variant="blue"
              className="rounded-full px-8 py-3 text-lg"
            >
              <Link to="/fleet">View Fleet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-[#181818]">
        <div className="max-w-6xl mx-auto container-padding grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
              Our Story
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Founded in 2020 by passionate locals who understood Mhasla’s
              transportation challenges, Mhasla Wheels began as a humble fleet
              of just three vehicles — driven by a bold vision: to redefine how
              people move around our vibrant city.
            </p>
            <p className="text-gray-400 leading-relaxed">
              What started as a solution for reliable rides has grown into the
              city’s most trusted mobility brand. With a rapidly growing fleet
              and thousands of satisfied customers, we’ve built more than a
              business — we’ve built a community.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Today, Mhasla Wheels continues to support local drivers, power
              events, and drive the future of transportation — one ride at a
              time.
            </p>
          </div>

          {/* Right Visual */}
          <div className="flex justify-center">
            <div className="w-80 h-80 bg-[#1f1f1f] border border-red-800/40 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(255,0,0,0.15)]">
              <Car size={100} className="text-red-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-[#141414] text-center border-t border-red-800/10 border-b border-red-800/10">
        <div className="max-w-3xl mx-auto container-padding">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed text-gray-300 opacity-90">
            To provide safe, reliable, and comfortable transportation solutions
            that connect the people of Mhasla — while empowering our community,
            local economy, and sustainable future.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding bg-[#181818]">
        <div className="max-w-6xl mx-auto container-padding">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-[#1e1e1e] border border-red-800/30 rounded-xl p-6 text-center hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-transform"
              >
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center bg-red-600 text-white rounded-full">
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

      {/* Stats */}
      <section className="section-padding bg-[#121212] text-white pb-24">
        <div className="max-w-6xl mx-auto container-padding grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Happy Customers", value: "10,000+" },
            { label: "Vehicles", value: "50+" },
            { label: "Service Available", value: "24/7" },
            { label: "Years Experience", value: "4+" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#1b1b1b] border border-red-800/30 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition"
            >
              <div className="text-3xl font-bold text-red-500 mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-400 uppercase">
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
