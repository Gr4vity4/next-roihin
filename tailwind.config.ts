import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#D4AF37',
          50: '#F9F5E7',
          100: '#F3EAD0',
          200: '#E7D5A1',
          300: '#DBC072',
          400: '#D4AF37',
          500: '#B8941F',
          600: '#9B7A1A',
          700: '#7E6015',
          800: '#614610',
          900: '#442C0B',
        },
        green: {
          DEFAULT: '#006039',
          50: '#E6F4EE',
          100: '#CCE9DD',
          200: '#99D3BB',
          300: '#66BD99',
          400: '#33A777',
          500: '#009155',
          600: '#006039',
          700: '#004D2E',
          800: '#003A23',
          900: '#002718',
        },
        'light-gray': '#F5F5F5',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        prompt: ['var(--font-prompt)', 'sans-serif'],
        'mixed-lang': ['var(--font-playfair)', 'var(--font-prompt)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        // Default sans font now uses Mixed Language with automatic unicode-range switching
        'sans': ['var(--font-playfair)', 'var(--font-prompt)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scale-in': 'scaleIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      textShadow: {
        'DEFAULT': '0 2px 4px rgba(0, 0, 0, 0.5)',
        'lg': '0 4px 6px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 6px rgba(0, 0, 0, 0.7)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
        '.font-prompt-important': {
          fontFamily: 'var(--font-prompt), sans-serif !important',
        },
        '.numeric-text': {
          fontFamily: 'var(--font-prompt), sans-serif !important',
        },
        '.line-clamp-1': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '1',
        },
        '.line-clamp-2': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '2',
        },
        '.line-clamp-3': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '3',
        },
        '.line-clamp-4': {
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': '4',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config