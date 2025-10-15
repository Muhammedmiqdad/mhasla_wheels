import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Fleet", path: "/fleet" },
    { name: "Feedback", path: "/feedback" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName =
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : null);

  // Reusable link class
  const navLinkClass = (path: string) =>
    `relative text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
      isActive(path)
        ? "text-white after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-red-500 after:left-0 after:-bottom-1"
        : "text-white/70 hover:text-white hover:after:content-[''] hover:after:absolute hover:after:w-full hover:after:h-[2px] hover:after:bg-red-500 hover:after:left-0 hover:after:-bottom-1 hover:after:transition-all"
    }`;

  // Scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "backdrop-blur-md bg-black/70 shadow-lg border-b border-red-600/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-transform hover:scale-105"
            >
              <img
                src="/splash-logo.png"
                alt="Mhasla Wheels Logo"
                className="h-10 w-auto rounded-full bg-white p-1 shadow-sm"
              />
              <span className="text-2xl md:text-3xl font-bold tracking-wide text-white">
                Mhasla <span className="text-red-500">Wheels</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path} className={navLinkClass(item.path)}>
                  {item.name}
                </Link>
              ))}

              {/* Auth Links */}
              {!user ? (
                <>
                  <Link to="/login" className={navLinkClass("/login")}>
                    Login
                  </Link>
                  <Link to="/register" className={navLinkClass("/register")}>
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" className={navLinkClass("/profile")}>
                    Hi, {displayName}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white/70 hover:text-red-400 font-semibold uppercase tracking-wide transition-all"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-red-600 hover:bg-red-700 shadow-red-700/40 shadow-md hover:shadow-lg text-white font-semibold transition-all duration-500"
              >
                <Link to="/booking">Book Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-red-600/30 text-white shadow-lg">
            <nav className="flex flex-col p-5 space-y-5 animate-slide-in-down">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-lg font-semibold uppercase tracking-wide ${
                    isActive(item.path)
                      ? "text-red-500"
                      : "text-white/80 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth (Mobile) */}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-lg font-semibold uppercase tracking-wide text-white/80 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-lg font-semibold uppercase tracking-wide text-white/80 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className="text-lg font-semibold uppercase tracking-wide text-white/80 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hi, {displayName}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-lg font-semibold uppercase tracking-wide text-white/70 hover:text-red-500 text-left"
                  >
                    Logout
                  </button>
                </>
              )}

              {/* Mobile CTA */}
              <Button
                asChild
                size="lg"
                className="mt-4 w-full rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md hover:shadow-red-600/40 transition"
              >
                <Link to="/booking" onClick={() => setIsMenuOpen(false)}>
                  Book a Ride
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Floating Mobile CTA */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button
          asChild
          size="lg"
          className="rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-700/30 hover:shadow-red-600/40 transition-transform hover:scale-105"
        >
          <Link to="/booking">🚗</Link>
        </Button>
      </div>
    </>
  );
};

export default Header;
