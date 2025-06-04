import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Calming blues - promote tranquility and reduce anxiety
        serenity: {
          50: '#f0f7ff',
          100: '#e0f0ff',
          200: '#bae0ff',
          300: '#7cc6ff',
          400: '#36a6ff',
          500: '#0090ff',
          600: '#0070d1',
          700: '#0058a8',
          800: '#004687',
          900: '#003666',
        },
        // Healing greens - associated with nature and growth
        healing: {
          50: '#f2f9f6',
          100: '#e3f3ed',
          200: '#c1e7d9',
          300: '#8fd3bd',
          400: '#56b898',
          500: '#3a997c',
          600: '#2c7b63',
          700: '#266352',
          800: '#214f43',
          900: '#1c4238',
        },
        // Nurturing purples - promote creativity and mindfulness
        mindful: {
          50: '#f7f2ff',
          100: '#efe5ff',
          200: '#deccff',
          300: '#c4a3ff',
          400: '#a571ff',
          500: '#8f45ff',
          600: '#7928d9',
          700: '#6420b3',
          800: '#501a8c',
          900: '#401666',
        },
        // Warm colors for emotional support
        warmth: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Mental health platform specific colors
        sage: {
          light: '#D1E4D1',
          DEFAULT: '#98B498',
          dark: '#708870'
        },
        cream: {
          light: '#FFF9F0',
          DEFAULT: '#F5ECD6',
          dark: '#E6D5B8'
        },
        rose: {
          light: '#F7E4E4',
          DEFAULT: '#E8B4B4',
          dark: '#D49393'
        },
        mint: {
          light: '#E8F4F1',
          DEFAULT: '#CBE5DE',
          dark: '#A9CCC2'
        },
        charcoal: {
          light: '#6B7280',
          DEFAULT: '#4B5563',
          dark: '#374151'
        },
      },
      backgroundImage: {
        'calm-gradient': 'linear-gradient(to right bottom, rgb(240, 247, 255), rgb(224, 240, 255))',
        'healing-gradient': 'linear-gradient(to right bottom, rgb(242, 249, 246), rgb(227, 243, 237))',
        'mindful-gradient': 'linear-gradient(to right bottom, rgb(247, 242, 255), rgb(239, 229, 255))',
        'warmth-gradient': 'linear-gradient(to right bottom, rgb(255, 247, 237), rgb(255, 237, 213))',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'gentle-spin': 'gentle-spin 8s linear infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'gentle-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'softer': '0 4px 20px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 15px rgba(156, 163, 175, 0.15)',
        'glow-blue': '0 0 15px rgba(59, 130, 246, 0.15)',
        'glow-purple': '0 0 15px rgba(147, 51, 234, 0.15)',
      },
    },
  },
  plugins: [forms, typography],
}
