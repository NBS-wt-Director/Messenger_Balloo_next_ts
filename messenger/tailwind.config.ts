import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Тёмная тема
        'theme-dark': {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          'surface-hover': '#252525',
          border: '#2a2a2a',
          text: '#e5e5e5',
          muted: '#888888',
        },
        // Светлая тема
        'theme-light': {
          bg: '#ffffff',
          surface: '#f5f5f5',
          'surface-hover': '#ebebeb',
          border: '#e0e0e0',
          text: '#1a1a1a',
          muted: '#666666',
        },
        // Акцентные цвета
        accent: {
          green: '#22c55e',
          red: '#ef4444',
          yellow: '#eab308',
          purple: '#a855f7',
          orange: '#f97316',
          pink: '#ec4899',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
