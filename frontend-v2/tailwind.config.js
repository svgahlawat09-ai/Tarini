/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F8F1",
        ink: "#33312E",
        marigold: { DEFAULT: "#FBC97C", dark: "#F0A94E" },
        thread: { pink: "#F3A6B2", blue: "#A9CFEA", green: "#9DC9A0" },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Work Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        soft: "1.25rem",
      },
    },
  },
  plugins: [],
};
