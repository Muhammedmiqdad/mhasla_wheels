import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Contact', path: '/contact' },
  ];

  const phoneNumber = "+91-9876543210";
  const whatsappNumber = "+919876543210";
  const email = "info@mhaslawheels.com";
  const address = "123 Main Street, Mhasla City, State 456789";

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto container-padding section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/splash-logo.png"
                alt="Mhasla Wheels Logo"
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold">Mhasla Wheels</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 text-lg">
              Your trusted partner for comfortable and reliable transportation in Mhasla. 
              From daily commutes to special occasions, we've got you covered.
            </p>
            <div className="space-y-3">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center space-x-3 hover:text-accent transition-colors"
              >
                <Phone size={20} />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-3 hover:text-accent transition-colors"
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
                    className="text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 hover:text-accent transition-colors group"
              >
                <MessageCircle size={20} className="group-hover:animate-bounce" />
                <span>WhatsApp Chat</span>
              </a>
              <p className="text-primary-foreground/60 text-sm">
                Available 24/7 for your convenience
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2025 Mhasla Wheels. All rights reserved. Developed by Miqdad +965 41103254 | Your Ride, Your Way in Mhasla
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
