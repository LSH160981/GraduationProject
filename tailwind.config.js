/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      width: {
        '70vw': '70vw',
      },
      height: {
        '83vh': '83vh',
      },
    },
    screens: {
      maxd: { max: '767px' },
      // => @media (max-width: 767px) { ... }
      md: '768px',
      // => @media (min-width: 768px) { ... }
      '767_1150': { min: '767px', max: '1150px' },
      // 在视口宽度在 767px 到 1150px(包含 767px 和 1150px)之间的设备上应用这些样式规则
      // => @media (min-width: 767px) and (max-width: 1150px) { ... }
    },
  },
  plugins: [require('daisyui')],
};
