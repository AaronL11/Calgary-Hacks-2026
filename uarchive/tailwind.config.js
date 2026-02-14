/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        uofc: {
          red: "#D6001C",
          darkred: "#A40017",
          gold: "#FFB81C",
          charcoal: "#2D2D2D",
          light: "#F7F7F7",
        },
      },
    },
  },
  plugins: [],
};
