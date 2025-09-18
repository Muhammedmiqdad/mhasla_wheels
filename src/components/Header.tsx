import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Contact', path: '/contact' },
    { name: 'Feedback', path: '/feedback' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border z-40">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="/splash-logo.png"
              alt="Mhasla Wheels Logo"
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-primary">Mhasla Wheels</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'text-primary' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Book Ride Button (Desktop) */}
          <div className="hidden md:block">
            <Link
              to="/booking"
              className="btn-gradient text-primary-foreground font-semibold px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Book Your Ride
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link py-2 ${isActive(item.path) ? 'text-primary' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Book Ride Button (Mobile) */}
              <Link
                to="/booking"
                onClick={() => setIsMenuOpen(false)}
                className="btn-gradient text-primary-foreground font-semibold py-2 rounded-lg mt-4 text-center"
              >
                Book Your Ride
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
