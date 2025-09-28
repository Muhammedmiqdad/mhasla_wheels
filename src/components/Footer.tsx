// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
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
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto container-padding section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary text-primary-foreground">
                <img
                  src="/splash-logo.png"
                  alt="Mhasla Wheels"
                  className="h-6 w-auto"
                />
              </div>
              <span className="text-2xl font-bold">Mhasla Wheels</span>
            </div>
            <p className="opacity-90 mb-6 text-lg">
              Your trusted partner for comfortable and reliable transportation
              in Mhasla. From daily commutes to special occasions, we've got you
              covered.
            </p>
            <div className="space-y-3">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center space-x-3 hover:text-primary transition-colors"
              >
                <Phone size={20} />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-3 hover:text-primary transition-colors"
              >
                <Mail size={20} />
                <span>{email}</span>
              </a>
              <div className="flex items-center space-x-3">
                <MapPin size={20} />
                <span>{address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button
                  variant="blue"
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp Chat</span>
                </Button>
              </a>
              <p className="opacity-70 text-sm">
                Available 24/7 for your convenience
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Social Media */}
        <div className="border-t border-primary/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="opacity-70 text-sm">
            © {currentYear} Mhasla Wheels. All rights reserved. | Your Ride, Your Way in Mhasla
          </p>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
