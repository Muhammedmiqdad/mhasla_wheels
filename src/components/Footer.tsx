// src/components/Footer.tsx
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

const Footer = () => {
  const quickLinks = [
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Fleet", path: "/fleet" },
    { name: "Feedback", path: "/feedback" },
    { name: "Contact", path: "/contact" },
  ];

  const phoneNumber = "+91-9876543210";
  const whatsappNumber = "+919876543210";
  const email = "info@mhaslawheels.com";
  const address = "123 Main Street, Mhasla City, State 456789";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-black via-[#0d0d0d] to-red-950 text-gray-200 overflow-hidden">
      {/* Subtle Red Glow Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,0,0,0.15)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto container-padding section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 text-center md:text-left">
            <Link
              to="/"
              className="flex items-center justify-center md:justify-start gap-3 mb-5 hover:opacity-90 hover:scale-105 transition-transform"
            >
              <img
                src="/splash-logo.png"
                alt="Mhasla Wheels Logo"
                className="h-10 w-auto rounded-full bg-white p-1 shadow-md"
              />
              <span className="text-2xl font-bold tracking-wide text-white">
                Mhasla <span className="text-red-500">Wheels</span>
              </span>
            </Link>

            <p className="opacity-80 mb-6 text-base leading-relaxed">
              Your trusted partner for safe, stylish, and reliable transportation
              in Mhasla — from local rides to luxury tours, we’ve got you covered.
            </p>

            <div className="space-y-3 text-sm">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center md:justify-start gap-3 hover:text-red-400 transition-all"
              >
                <Phone size={18} />
                <span>{phoneNumber}</span>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center justify-center md:justify-start gap-3 hover:text-red-400 transition-all"
              >
                <Mail size={18} />
                <span>{email}</span>
              </a>

              <div className="flex items-center justify-center md:justify-start gap-3 text-gray-400">
                <MapPin size={18} />
                <span>{address}</span>
              </div>
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
            <div className="space-y-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-red-600 text-white hover:bg-red-600/20 hover:border-red-400 transition-all"
                >
                  <MessageCircle size={18} />
                  <span>WhatsApp Chat</span>
                </Button>
              </a>
              <p className="opacity-70 text-sm">Available 24/7 for support</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-red-800/40 my-12" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-sm text-gray-400">
            © {currentYear} <span className="text-white">Mhasla Wheels</span>.
            All rights reserved. |{" "}
            <span className="text-red-400">Your Ride, Your Way in Mhasla</span>
          </p>

          {/* Social Media */}
          <div className="flex items-center gap-4">
            {[
              { icon: Facebook, href: "https://facebook.com" },
              { icon: Instagram, href: "https://instagram.com" },
              { icon: Twitter, href: "https://twitter.com" },
              { icon: Linkedin, href: "https://linkedin.com" },
            ].map(({ icon: Icon, href }, idx) => (
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
