/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy — the panel's primary brand color (buttons, active nav, links)
        primary: {
          DEFAULT: "#152A4A",
          50: "#EEF2F8",
          100: "#DCE3EF",
          200: "#B5C2DA",
          300: "#8397B9",
          400: "#4E6690",
          500: "#223F69",
          600: "#0F2038",
          700: "#0A1626",
          800: "#060E18",
          900: "#03080D",
        },
        // Warm gold — reserved for premium accents: highlights, badges, focus flourishes
        accent: {
          DEFAULT: "#B68A4E",
          50: "#FBF6EE",
          100: "#F3E6CC",
          400: "#C9A467",
          500: "#B68A4E",
          600: "#96702E",
        },
        danger: "#D0384F",
        success: "#1E9A63",
        surface: {
          DEFAULT: "#ffffff",
          soft: "#F7F8FB",
          muted: "#ECEFF5",
        },
        border: {
          DEFAULT: "#E4E8F0",
        },
        ink: {
          900: "#11151F",
          800: "#1B2130",
          700: "#3A4152",
          500: "#636B7E",
          400: "#8991A3",
          300: "#B2B9C7",
          200: "#DCE0E9",
          100: "#EFF1F6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17, 21, 31, 0.04), 0 4px 14px rgba(17, 21, 31, 0.05)",
        lift: "0 10px 30px rgba(17, 21, 31, 0.12)",
        glow: "0 6px 20px rgba(21, 42, 74, 0.22)",
      },
    },
  },
  plugins: [],
};
