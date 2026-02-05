/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#00ade8",
        gray: {
          950: "#0a0a0f",
          900: "#111827",
          850: "#1a1f2e",
          800: "#1f2937",
        },
      },
      fontFamily: {
        montserrat: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
