import { useEffect, useState } from 'react';
import { Car, RotateCw } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onLoadingComplete, 500); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-primary z-50 flex items-center justify-center transition-opacity duration-500 opacity-0 pointer-events-none">
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-primary-dark z-50 flex items-center justify-center">
      <div className="text-center text-primary-foreground">
        {/* Car with spinning wheels */}
        <div className="relative mb-8">
          <Car size={120} className="loading-car text-primary-foreground" />
          <div className="absolute -bottom-2 left-6">
            <RotateCw size={24} className="loading-wheel text-accent" />
          </div>
          <div className="absolute -bottom-2 right-6">
            <RotateCw size={24} className="loading-wheel text-accent" />
          </div>
        </div>
        
        {/* Brand name */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
          Mhasla Wheels
        </h1>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl opacity-90 animate-fade-in-up">
          Your Ride, Your Way
        </p>
        
        {/* Loading dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;