// src/components/Footer.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";

interface Settings {
  phone?: string;
  email?: string;
  address?: string;
  whatsapp_link?: string;
  facebook_link?: string;
  instagram_link?: string;
  twitter_link?: string;
  linkedin_link?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

const Footer = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Fleet", path: "/fleet" },
    { name: "Feedback", path: "/feedback" },
    { name: "Contact", path: "/contact" },
  ];

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from("settings").select("*").limit(1).single();
      if (error) console.error("❌ Error fetching settings:", error);
      else setSettings(data || {});
      setLoading(false);
    };

    fetchSettings();

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

  if (loading) {
    return (
      <footer className="bg-[#0b0b0b] text-center text-gray-400 py-10">
        Loading footer...
      </footer>
    );
  }

  return (
    <footer className="relative bg-gradient-to-br from-black via-[#0b0b0b] to-[#2a0000] text-gray-200 overflow-hidden">
      {/* Subtle Red Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,0,0,0.18)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-20 md:py-24">
        {/* ✅ Use 3 equal columns for perfect alignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <Link
              to="/"
              className="flex items-center justify-center md:justify-start gap-4 mb-5 hover:opacity-90 hover:scale-105 transition-transform"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-red-600/25 blur-2xl rounded-full -z-10" />
                <img
                  src="/splash-logo.png"
                  alt="Mhasla Wheels Logo"
                  className="h-14 w-14 md:h-16 md:w-16 object-contain rounded-full bg-white p-1.5 shadow-[0_0_15px_rgba(255,0,0,0.35)]"
                />
              </div>
              <span className="text-3xl font-extrabold tracking-wide text-white leading-none">
                Mhasla <span className="text-white">Wheels</span>
              </span>
            </Link>

            <p className="opacity-80 mb-6 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              Your trusted partner for safe, stylish, and reliable transportation
              in Mhasla — from local rides to luxury tours, we’ve got you covered.
            </p>

            <div className="space-y-3 text-sm md:text-base">
              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="flex items-center justify-center md:justify-start gap-3 hover:text-red-400 transition-all"
                >
                  <Phone size={18} />
                  <span>{settings.phone}</span>
                </a>
              )}

              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center justify-center md:justify-start gap-3 hover:text-red-400 transition-all"
                >
                  <Mail size={18} />
                  <span>{settings.email}</span>
                </a>
              )}

              {settings.address && (
                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400">
                  <MapPin size={18} />
                  <span>{settings.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-4 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-10 after:h-[2px] after:bg-red-600">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-red-400 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp & Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-4 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-10 after:h-[2px] after:bg-red-600">
              Get in Touch
            </h3>
            <div className="space-y-5">
              {settings.whatsapp_link && (
                <a
                  href={settings.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 border-red-600 text-white hover:bg-red-600/20 hover:border-red-400 transition-all text-base rounded-full"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp Chat</span>
                  </Button>
                </a>
              )}
              <p className="opacity-70 text-sm md:text-base">
                Available <span className="text-red-400 font-semibold">24/7</span> for support
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-red-800/40 my-12" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-sm md:text-base text-gray-400">
            © {currentYear} <span className="text-white font-semibold">Mhasla Wheels</span>. 
            All rights reserved. |{" "}
            <span className="text-red-400">Your Ride, Your Way in Mhasla</span>
          </p>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            {[
              { icon: Facebook, href: settings.facebook_link || settings.facebook },
              { icon: Instagram, href: settings.instagram_link || settings.instagram },
              { icon: Twitter, href: settings.twitter_link || settings.twitter },
              { icon: Linkedin, href: settings.linkedin_link || settings.linkedin },
            ]
              .filter((s) => s.href)
              .map(({ icon: Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full border border-red-700 text-gray-300 hover:text-white hover:border-red-400 hover:bg-red-600/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
              ))}
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />
    </footer>
  );
};

export default Footer;
