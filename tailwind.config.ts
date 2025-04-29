// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['var(--font-inter)'],
        'cinzel': ['var(--font-cinzel)'],
        'eb-garamond': ['var(--font-eb-garamond)'],
        'italianno': ['var(--font-italianno)'],
      },
      colors: {
        'parchment': '#F5F2E8',
        'medieval-red': '#7F1D1D',
        'medieval-blue': '#000080',
        'medieval-gold': '#B7922A',
      },
      backgroundImage: {
        'paper-texture': "url('/paper-texture.png')",
      },
      animation: {
        'page-turn': 'pageTurn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'slide-out': 'slideOut 0.3s ease-in forwards',
      },
      keyframes: {
        pageTurn: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-180deg)' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      boxShadow: {
        'book': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}

export default config