import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    navigate("/"); // ✅ redirect home after logout
  };

  // ✅ Get display name (prefer user_metadata.name)
  const displayName =
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : null);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#666666] text-white shadow-md z-40">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Brand */}
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-90 hover:scale-105 transition-transform"
            >
              <img
                src="/splash-logo.png"
                alt="Mhasla Wheels Logo"
                className="h-10 w-auto rounded-full bg-white p-1 shadow-sm"
              />
              <span className="text-2xl font-bold tracking-wide">
                Mhasla Wheels
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`nav-link transition-colors ${
                    isActive(item.path)
                      ? "text-white font-semibold border-b-2 border-white"
                      : "text-white/80 hover:text-white font-semibold"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Auth Links */}
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className={`nav-link transition-colors ${
                      isActive("/login")
                        ? "text-white font-semibold border-b-2 border-white"
                        : "text-white/80 hover:text-white font-semibold"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`nav-link transition-colors ${
                      isActive("/register")
                        ? "text-white font-semibold border-b-2 border-white"
                        : "text-white/80 hover:text-white font-semibold"
                    }`}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    className={`nav-link transition-colors ${
                      isActive("/profile")
                        ? "text-white font-semibold border-b-2 border-white"
                        : "text-white/80 hover:text-white font-semibold"
                    }`}
                  >
                    Hi, {displayName}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white/80 hover:text-white font-semibold transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>

            {/* Desktop CTA (red button) */}
            <div className="hidden md:block">
              <Button
                asChild
                size="lg"
                className="shadow-floating bg-red-600 text-white rounded-full px-6 py-2 
                           hover:bg-red-700 hover:scale-105 transition-transform"
              >
                <Link to="/booking">Book Your Ride</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20 bg-[#666666] text-white">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    aria-current={isActive(item.path) ? "page" : undefined}
                    className={`nav-link py-2 ${
                      isActive(item.path)
                        ? "text-white font-semibold border-b border-white"
                        : "text-white/80 hover:text-white font-semibold"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Auth Links (mobile) */}
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      className="text-white/80 hover:text-white font-semibold transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-white/80 hover:text-white font-semibold transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      className="text-white/80 hover:text-white font-semibold transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Hi, {displayName}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-white/80 hover:text-white font-semibold transition-colors text-left"
                    >
                      Logout
                    </button>
                  </>
                )}

                {/* Mobile CTA inside menu (red button) */}
                <Button
                  asChild
                  size="lg"
                  className="mt-4 w-full bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                >
                  <Link to="/booking" onClick={() => setIsMenuOpen(false)}>
                    Book Your Ride
                  </Link>
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Floating CTA (mobile only, red button) */}
      <Link
        to="/booking"
        className="fixed bottom-6 right-6 z-50 md:hidden 
                   bg-red-600 text-white font-semibold tracking-wide
                   px-6 py-3 rounded-full shadow-floating 
                   hover:bg-red-700 hover:scale-110 active:scale-95 
                   transition-transform duration-300"
      >
        Book Now
      </Link>
    </>
  );
};

export default Header;
