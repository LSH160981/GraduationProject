/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '70vw': '70vw',
      },
      height: {
        '83vh': '83vh',
      }
    },
    screens: {
      'maxd': { 'max': '767px' },
      // => @media (max-width: 767px) { ... } 
      'md': '768px',
      // => @media (min-width: 768px) { ... }
    },
  },
  plugins: [
    require("daisyui")
  ],
}

