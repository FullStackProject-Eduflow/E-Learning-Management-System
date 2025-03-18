const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // ✅ Enable dark mode
  theme: {
    extend: {
      colors: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        primary: "oklch(0.205 0 0)",
        secondary: "oklch(0.97 0 0)",
        border: "oklch(0.922 0 0)",
      },
      borderRadius: {
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // ✅ Fix plugin error
  ],
};