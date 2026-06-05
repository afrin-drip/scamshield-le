import type { Config } from 'tailwindcss';
const config: Config = {
  darkMode: 'class',
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1E3A5F', 50: '#E8EEF5', 100: '#C5D4E6', 200: '#9FB7D3', 300: '#7499C1', 400: '#4F7DAF', 500: '#1E3A5F', 600: '#1A3354', 700: '#152A46', 800: '#102138', 900: '#0A1523' },
        accent: { DEFAULT: '#2563EB', light: '#3B82F6', dark: '#1D4ED8' },
        danger: '#DC2626', warning: '#D97706', success: '#16A34A',
        surface: { DEFAULT: '#0F1923', card: '#162232', border: '#1E3A5F', muted: '#1A2A3A' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] },
    },
  },
  plugins: [],
};
export default config;
