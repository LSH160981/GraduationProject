/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'maxd': { 'max': '767px' },
      // => @media (max-width: 767px) { ... } 
    },
  },
  plugins: [
    require("daisyui")
  ],
}

