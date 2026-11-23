/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09231A",   // dark green (nav, hero, stats, destinations, footer)
        brand: "#1B5B42", // forest green (icons, accents)
        rose: "#E5B13A",  // yellow (buttons and highlights)
        mist: "#F1F2EF",  // light grey sections
        char: "#252D29",  // charcoal main text
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "sans-serif"],
        body: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};