import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "-apple-system", "sans-serif"],
        serif: ['"Cormorant Garamond"', "serif"],
        script: ['"Dancing Script"', "cursive"],
      },
      colors: {
        indigo: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#5A67D8",
          600: "#5A67D8",
          700: "#4C51BF",
          800: "#434190",
          900: "#3730A3",
        },
        "cream-linen": "#FDFBF7",
        "deep-charcoal": "#2D2D2D",
        "olive-green": "#588157",
        terracotta: "#E2725B",
      },
      fontSize: {
        "display-lg": [
          "2rem",
          { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        "display-md": [
          "1.5rem",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "display-sm": [
          "1.0625rem",
          { lineHeight: "1.5", letterSpacing: "-0.005em", fontWeight: "400" },
        ],
        "label-lg": [
          "0.875rem",
          { lineHeight: "1.5", letterSpacing: "0.005em", fontWeight: "500" },
        ],
        "label-sm": [
          "0.8125rem",
          { lineHeight: "1.5", letterSpacing: "0.01em", fontWeight: "500" },
        ],
        caption: [
          "0.6875rem",
          { lineHeight: "1.6", letterSpacing: "0.08em", fontWeight: "500" },
        ],
      },
      boxShadow: {
        "glow-sm": "0 0 12px -2px rgba(90, 103, 216, 0.15)",
        glow: "0 0 24px -4px rgba(90, 103, 216, 0.2)",
        soft: "0 2px 16px -2px rgba(90, 103, 216, 0.10)",
        "soft-md": "0 4px 24px -4px rgba(90, 103, 216, 0.14)",
        "soft-lg": "0 8px 32px -4px rgba(90, 103, 216, 0.18)",
      },
      animation: {
        "fade-in": "fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-ring": "pulseRing 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseRing: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.15", transform: "scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
