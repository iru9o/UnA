import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#1a1814',
          surface: '#2a2520',
          border: '#3d3630',
        },
        text: {
          primary: '#f5f0e8',
          secondary: '#a89f94',
        },
        accent: {
          DEFAULT: '#d4a574',
          hover: '#e8c49a',
        },
        success: '#7ab87a',
        warning: '#d4a574',
        error: '#c47070',
        station: {
          cutting: '#7ab87a',
          fry: '#d4a574',
          drink: '#6b9bd1',
          stove: '#c47070',
        },
      },
      fontFamily: {
        sans: ['var(--font-cabinet)'],
        mono: ['var(--font-jetbrains)'],
      },
    },
  },
  plugins: [],
}

export default config
