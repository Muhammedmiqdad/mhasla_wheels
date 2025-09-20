import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: "+965-98765432",
      description: "Call us anytime for immediate assistance",
      action: "tel:+96598765432",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@mhaslawheels.com",
      description: "Send us your queries and feedback",
      action: "mailto:info@mhaslawheels.com",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: "Chat with us",
      description: "Quick response via WhatsApp",
      action: "https://wa.me/96598765432",
    },
    {
      icon: MapPin,
      title: "Address",
      content: "Kuwait City, Kuwait",
      description: "Visit our office for in-person assistance",
      action: null,
    },
  ];

  const businessHours = [
    { day: "Monday - Friday", hours: "8:00 AM - 10:00 PM" },
    { day: "Saturday", hours: "8:00 AM - 11:00 PM" },
    { day: "Sunday", hours: "9:00 AM - 9:00 PM" },
    { day: "Emergency", hours: "24/7 Available" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onBookRide={() => setIsBookingModalOpen(true)} />

      {/* Hero Section with yellow background (client spec) */}
      <section className="pt-24 section-padding bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h1 className="text-responsive-xl font-bold mb-6 animate-fade-in-up">
            Contact Us
          </h1>
          <p className="text-responsive-md opacity-90 animate-fade-in-up">
            Get in touch with us for bookings, inquiries, or support
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="service-card text-center">
                <div className="service-icon mx-auto">
                  <info.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  {info.title}
                </h3>
                {info.action ? (
                  <a
                    href={info.action}
                    target={info.action.startsWith("http") ? "_blank" : undefined}
                    rel={
                      info.action.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-primary hover:text-primary-light font-medium transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-primary font-medium">{info.content}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {info.description}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Send us a Message
                </h2>
                <p className="text-muted-foreground mb-6">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Your Name" className="bg-background border-border" />
                  <Input placeholder="Phone Number" type="tel" className="bg-background border-border" />
                </div>
                <Input placeholder="Email Address" type="email" className="bg-background border-border" />
                <Input placeholder="Subject" className="bg-background border-border" />
                <Textarea
                  placeholder="Your Message"
                  rows={5}
                  className="bg-background border-border resize-none"
                />
                <Button variant="book" className="w-full py-3">
                  <Send size={20} className="mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Map and Business Hours */}
            <div className="space-y-8">
              {/* Google Maps Embed for Kuwait City */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Find Us
                </h3>
                <div className="aspect-video bg-secondary rounded-xl overflow-hidden border border-border">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3476.042973589171!2d47.97832911505681!3d29.375859982126188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf9b4d9a51c5af%3A0xd1b4df25b7c6d7b4!2sKuwait%20City%2C%20Kuwait!5e0!3m2!1sen!2skw!4v1695112345678!5m2!1sen!2skw"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mhasla Wheels Kuwait Location"
                  />
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <Clock size={24} className="mr-2 text-primary" />
                  Business Hours
                </h3>
                <div className="bg-card rounded-xl p-6 border border-border">
                  <div className="space-y-3">
                    {businessHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-card-foreground font-medium">
                          {schedule.day}
                        </span>
                        <span
                          className={
                            schedule.day === "Emergency"
                              ? "text-accent font-semibold"
                              : "text-muted-foreground"
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

      {/* Emergency Contact */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center container-padding">
          <h2 className="text-2xl font-bold mb-4">
            Emergency? Need Immediate Assistance?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Our emergency hotline is available 24/7 for urgent transportation needs.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="tel:+96598765432">
              <Button variant="book" className="px-8 py-3 text-lg">
                <Phone size={20} className="mr-2" />
                Emergency Hotline
              </Button>
            </a>
            <a
              href="https://wa.me/96598765432?text=Emergency%20ride%20needed"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="blue" className="px-8 py-3 text-lg">
                <MessageCircle size={20} className="mr-2" />
                WhatsApp Emergency
              </Button>
            </a>
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
