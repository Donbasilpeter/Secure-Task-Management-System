const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#511730",   // brand color
          dark: "#3a1023",      // hover / pressed
          light: "#73204a",     // accents
        },
        secondary: {
          DEFAULT: "#FFFFFB",   // light surfaces
          dark: "#f0f0ed",      // subtle contrast
          light: "#ffffff",     // pure white
        },
        tertiary: {
          DEFAULT: "#00171F",   // deep navy
          dark: "#000d12",      // almost black
          light: "#002633",     // slightly softer navy
        },
        accent: {
          gold: "#d4af37",      // optional highlight
          rose: "#e63946",      // alerts / CTA
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "1rem", // rounded-card
        button: "0.5rem", // rounded-button
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
