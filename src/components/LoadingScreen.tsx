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

    if (video) {
      video
        .play()
        .then(() => console.log("video.play() success"))
        .catch((err) => console.warn("Video autoplay failed:", err));
    }

    // Fallback timer
    const fallback = setTimeout(() => {
      triggerFadeOut();
    }, 4000);

    const handleEnded = () => triggerFadeOut();

    video?.addEventListener("ended", handleEnded);

    return () => {
      clearTimeout(fallback);
      video?.removeEventListener("ended", handleEnded);
    };
  }, []);

  const triggerFadeOut = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      onLoadingComplete();
    }, 1000); // match fade-out duration
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-gradient-to-br from-primary to-primary-dark
        ${isFading ? "animate-fadeOut" : "animate-fadeIn"}
      `}
    >
      {/* Jeep loader video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-40 md:w-64 drop-shadow-lg"
      >
        <source src="/jeep-loader.webm" type="video/webm" />
        <source src="/jeep-loader.mp4" type="video/mp4" />
      </video>

      {/* Branding text */}
      <div className="mt-6 text-center text-primary-foreground">
        <h1 className="text-3xl md:text-5xl font-bold animate-fade-in-up">
          Mhasla Wheels
        </h1>
        <p className="text-lg md:text-2xl opacity-90 animate-fade-in-up">
          Your Ride, Your Way
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
