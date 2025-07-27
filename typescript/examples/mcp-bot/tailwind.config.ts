import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'kakao-yellow': '#FEE500',
        'kakao-brown': '#3C1E1E',
      },
    },
  },
  plugins: [],
};
module.exports = config;
