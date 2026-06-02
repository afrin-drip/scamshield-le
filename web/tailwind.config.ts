import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'scam-red': '#D32F2F',
        'scam-orange': '#E64A19',
        'scam-yellow': '#F57F17',
        'safe-green': '#388E3C',
      },
    },
  },
  plugins: [],
};

export default config;