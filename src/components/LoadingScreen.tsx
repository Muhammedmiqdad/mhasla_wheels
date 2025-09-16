import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onLoadingComplete, 500); // Allow fade-out effect
    }, 3000); // Show for 3 seconds

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Client Splash Logo */}
      <img
        src="/splash-logo.png" // make sure this file is in the public/ folder
        alt="Mhasla Wheels Logo"
        className="w-64 h-auto animate-pulse"
      />
    </div>
  );
};

export default LoadingScreen;
