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
        bg-white overflow-hidden
        ${isFading ? "animate-fadeOut" : "animate-fadeIn"}`}
    >
      {/* Subtle white gradient backdrop for softness */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-[#fefefe]" />

      {/* Centered content */}
      <div className="relative flex flex-col items-center space-y-10">
        {/* --- Blended Logo --- */}
        <div className="relative">
          <img
            src="/splash-logo.png"
            alt="Mhasla Wheels Logo"
            className="w-40 md:w-56 object-contain relative z-10"
          />
          {/* Gentle ambient glow behind logo */}
          <div className="absolute inset-0 bg-white blur-2xl opacity-70" />
        </div>

        {/* --- Blended Jeep --- */}
        <div className="relative flex flex-col items-center">
          <div className="absolute inset-0 bg-yellow-100 blur-[100px] opacity-30" />
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="relative w-44 md:w-72 drop-shadow-[0_8px_16px_rgba(0,0,0,0.05)] animate-float"
          >
            <source src="/jeep-loader.webm" type="video/webm" />
            <source src="/jeep-loader.mp4" type="video/mp4" />
          </video>
        </div>

        {/* --- Text --- */}
        <div className="text-center text-gray-700 animate-fade-in-up">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            Mhasla Wheels
          </h1>
          <p className="text-lg md:text-xl text-gray-500">Your Ride, Your Way</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
