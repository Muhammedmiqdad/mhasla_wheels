// tailwind.config.ts

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#0B0B0B", // deep black background
        foreground: "#FFFFFF", // white text
        primary: {
          DEFAULT: "#FF3B3B", // electric red
          light: "#FF5C5C",   // hover red
          dark: "#CC2F2F",    // deep red
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1A1A1A", // dark grey cards
          light: "#2E2E2E",   // lighter grey hover
          foreground: "#E5E5E5", // muted white text
        },
        muted: {
          DEFAULT: "#999999",
          foreground: "#B3B3B3",
        },
        border: "#2E2E2E",
        input: "#333333",
        destructive: {
          DEFAULT: "#E02424", // alert red
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#FFFFFF",
          foreground: "#0B0B0B",
        },
        card: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        xl: "1rem",
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        card: "0 4px 10px rgba(0,0,0,0.4)",
        floating: "0 15px 30px rgba(0,0,0,0.6)",
        glow: "0 0 20px rgba(255, 59, 59, 0.6)", // red glow effect
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
