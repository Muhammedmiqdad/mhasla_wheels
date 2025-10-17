// src/pages/Contact.tsx
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/supabaseClient";

interface Settings {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp_link?: string;
}

const Contact = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  // 🧩 Fetch settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from("settings").select("*").limit(1).single();
      if (error) console.error("❌ Error fetching settings:", error);
      else setSettings(data || {});
      setLoading(false);
    };

    fetchSettings();

    // Optional realtime subscription — updates instantly when admin edits
    const channel = supabase
      .channel("realtime:settings")
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const businessHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 10:00 PM" },
    { day: "Saturday", hours: "8:00 AM - 11:00 PM" },
    { day: "Sunday", hours: "9:00 AM - 9:00 PM" },
    { day: "Emergency", hours: "24/7 Available" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex justify-center items-center">
        <p className="text-gray-400">Loading contact info...</p>
      </div>
    );
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: settings.phone || "N/A",
      description: "Call us anytime for immediate assistance",
      action: settings.phone ? `tel:${settings.phone}` : null,
    },
    {
      icon: Mail,
      title: "Email",
      content: settings.email || "N/A",
      description: "Send us your queries and feedback",
      action: settings.email ? `mailto:${settings.email}` : null,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "Chat with us",
      description: "Quick response via WhatsApp",
      action: settings.whatsapp_link || null,
    },
    {
      icon: MapPin,
      title: "Address",
      content: settings.address || "Mhasla, India",
      description: "Visit our office for in-person assistance",
      action: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-16 bg-[#181818] text-center border-b border-red-800/20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Get in <span className="text-red-500">Touch</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Reach out for bookings, inquiries, or support — we’re here to help.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 bg-[#141414] border-b border-red-800/10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Contact Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-[#1f1f1f] border border-red-800/30 rounded-2xl p-6 text-center hover:shadow-[0_0_25px_rgba(255,0,0,0.25)] transition-all"
              >
                <div className="flex justify-center items-center w-14 h-14 mx-auto mb-4 rounded-full bg-red-600 text-white shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                  <info.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                {info.action ? (
                  <a
                    href={info.action}
                    target={
                      info.action.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      info.action.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-red-400 hover:text-red-500 font-medium transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-red-400 font-medium">{info.content}</p>
                )}
                <p className="text-sm text-gray-400 mt-2">{info.description}</p>
              </div>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Send Us a Message
                </h2>
                <p className="text-gray-400 mb-6">
                  Fill out the form below and we’ll get back to you as soon as
                  possible.
                </p>
              </div>

              <form className="space-y-4 bg-[#1f1f1f] p-8 rounded-2xl border border-red-800/30 shadow-[0_0_20px_rgba(255,0,0,0.1)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Your Name"
                    className="bg-[#121212] border border-red-800/30 text-white placeholder-gray-500"
                  />
                  <Input
                    placeholder="Phone Number"
                    type="tel"
                    className="bg-[#121212] border border-red-800/30 text-white placeholder-gray-500"
                  />
                </div>
                <Input
                  placeholder="Email Address"
                  type="email"
                  className="bg-[#121212] border border-red-800/30 text-white placeholder-gray-500"
                />
                <Input
                  placeholder="Subject"
                  className="bg-[#121212] border border-red-800/30 text-white placeholder-gray-500"
                />
                <Textarea
                  placeholder="Your Message"
                  rows={5}
                  className="bg-[#121212] border border-red-800/30 text-white placeholder-gray-500 resize-none"
                />
                <Button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold">
                  <Send size={18} className="mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Map & Business Hours */}
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Find Us
                </h3>
                <div className="aspect-video bg-[#1f1f1f] border border-red-800/30 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(255,0,0,0.1)]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3476.042973589171!2d47.97832911505681!3d29.375859982126188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9b4d9a51c5af%3A0xd1b4df25b7c6d7b4!2sKuwait%20City%2C%20Kuwait!5e0!3m2!1sen!2skw!4v1695112345678!5m2!1sen!2skw"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mhasla Wheels Location"
                  />
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                  <Clock size={22} className="mr-2 text-red-500" />
                  Business Hours
                </h3>
                <div className="bg-[#1f1f1f] border border-red-800/30 rounded-2xl p-6">
                  <div className="space-y-3">
                    {businessHours.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-300 font-medium">
                          {schedule.day}
                        </span>
                        <span
                          className={
                            schedule.day === "Emergency"
                              ? "text-red-400 font-semibold"
                              : "text-gray-400"
                          }
                        >
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-20 bg-[#181818] text-center border-t border-red-800/20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">
            Emergency? <span className="text-red-500">We’re Available 24/7</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Our emergency hotline is active day and night. Contact us for urgent
            rides anytime.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {settings.phone && (
              <a href={`tel:${settings.phone}`}>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg">
                  <Phone size={20} className="mr-2" />
                  Emergency Hotline
                </Button>
              </a>
            )}
            {settings.whatsapp_link && (
              <a
                href={`${settings.whatsapp_link}?text=Emergency%20ride%20needed`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg">
                  <MessageCircle size={20} className="mr-2" />
                  WhatsApp Emergency
                </Button>
              </a>
            )}
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

export default Contact;
