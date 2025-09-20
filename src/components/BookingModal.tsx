import { X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ isOpen, onClose }: BookingModalProps) => {
  if (!isOpen) return null;

  const phoneNumber = "+91-9876543210";
  const whatsappNumber = "+919876543210";
  const whatsappMessage =
    "Hi! I'm interested in booking a ride with Mhasla Wheels.";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-floating max-w-md w-full mx-4 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-card-foreground">
            Book Your Ride
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-secondary text-secondary-foreground">
              <MessageCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-card-foreground">
              Feature Under Development
            </h3>
            <p className="text-muted-foreground mb-6">
              Our online booking system is coming soon! For now, please contact
              us directly to book your ride.
            </p>
          </div>

          {/* Contact Options */}
          <div className="space-y-3">
            <a href={`tel:${phoneNumber}`} className="w-full block">
              <Button
                variant="book"
                className="w-full flex items-center justify-center space-x-2 py-3"
              >
                <Phone size={20} />
                <span>Call {phoneNumber}</span>
              </Button>
            </a>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button
                variant="blue"
                className="w-full flex items-center justify-center space-x-2 py-3 bg-green-600 hover:bg-green-700"
              >
                <MessageCircle size={20} />
                <span>WhatsApp Us</span>
              </Button>
            </a>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-4">
            We'll get back to you within minutes!
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
