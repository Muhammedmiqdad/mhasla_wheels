import { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.play().catch(() => null);

    const fallback = setTimeout(triggerFadeOut, 4000);
    video?.addEventListener("ended", triggerFadeOut);
    return () => {
      clearTimeout(fallback);
      video?.removeEventListener("ended", triggerFadeOut);
    };
  }, []);

  const triggerFadeOut = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete();
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center 
        bg-gradient-to-b from-white to-gray-100 overflow-hidden
        ${isFading ? "animate-fadeOut" : "animate-fadeIn"}`}
    >
      {/* Logo with soft card shadow */}
      <div className="bg-white shadow-xl rounded-xl p-3 mb-8 animate-fade-in-up">
        <img
          src="/splash-logo.png"
          alt="Mhasla Wheels Logo"
          className="w-40 md:w-56 drop-shadow-sm"
        />
      </div>

      {/* Soft halo glow behind jeep */}
      <div className="relative">
        <div className="absolute inset-0 w-48 h-48 rounded-full bg-yellow-300/20 blur-2xl animate-pulse-slow"></div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="relative w-44 md:w-72 drop-shadow-lg animate-float"
        >
          <source src="/jeep-loader.webm" type="video/webm" />
          <source src="/jeep-loader.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Text */}
      <div className="mt-6 text-center text-gray-700 animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          Mhasla Wheels
        </h1>
        <p className="text-lg md:text-xl opacity-80">Your Ride, Your Way</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
