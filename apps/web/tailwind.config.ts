import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b0f19',
        surface: '#131826',
        border: '#232a3d',
      },
    },
  },
  plugins: [],
};

export default config;
