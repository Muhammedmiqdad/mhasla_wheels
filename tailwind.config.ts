// import type { Config } from "tailwindcss";

// export default {
//   darkMode: ["class"],
//   content: [
//     "./pages/**/*.{ts,tsx}",
//     "./components/**/*.{ts,tsx}",
//     "./app/**/*.{ts,tsx}",
//     "./src/**/*.{ts,tsx}",
//   ],
//   prefix: "",
//   theme: {
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//           light: "hsl(var(--primary-light))",
//           dark: "hsl(var(--primary-dark))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//           dark: "hsl(var(--secondary-dark))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//           light: "hsl(var(--accent-light))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//         sidebar: {
//           DEFAULT: "hsl(var(--sidebar-background))",
//           foreground: "hsl(var(--sidebar-foreground))",
//           primary: "hsl(var(--sidebar-primary))",
//           "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
//           accent: "hsl(var(--sidebar-accent))",
//           "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
//           border: "hsl(var(--sidebar-border))",
//           ring: "hsl(var(--sidebar-ring))",
//         },
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       boxShadow: {
//         card: "var(--shadow-card)",
//         hero: "var(--shadow-hero)",
//         floating: "var(--shadow-floating)",
//       },
//       keyframes: {
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//         "fade-in-up": {
//           "0%": { opacity: "0", transform: "translateY(20px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         "fade-out": {
//           "0%": { opacity: "1" },
//           "100%": { opacity: "0" },
//         },
//         "spin-slow": {
//           "0%": { transform: "rotate(0deg)" },
//           "100%": { transform: "rotate(360deg)" },
//         },
//         "bounce-delay": {
//           "0%, 80%, 100%": { transform: "scale(0)" },
//           "40%": { transform: "scale(1)" },
//         },
//         // 🔥 New global fade
//         fadeIn: {
//           "0%": { opacity: "0" },
//           "100%": { opacity: "1" },
//         },
//         fadeOut: {
//           "0%": { opacity: "1" },
//           "100%": { opacity: "0" },
//         },
//       },
//       animation: {
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//         "fade-in-up": "fade-in-up 0.8s ease-out forwards",
//         "fade-out": "fade-out 0.8s ease-in forwards",
//         "spin-slow": "spin-slow 1.5s linear infinite",
//         "bounce-delay": "bounce-delay 1.4s infinite both",
//         // 🔥 New
//         fadeIn: "fadeIn 1s ease-out forwards",
//         fadeOut: "fadeOut 1s ease-in forwards",
//       },
//     },
//   },
//   plugins: [require("tailwindcss-animate")],
// } satisfies Config;




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
