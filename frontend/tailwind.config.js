/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#FAFAF8',
          raised: '#FFFFFF',
          muted: '#F3F2EF',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          secondary: '#5C5C5C',
          muted: '#8A8A8A',
        },
        accent: {
          DEFAULT: '#0D6E6E',
          hover: '#0A5A5A',
          light: '#E8F4F4',
        },
        border: {
          DEFAULT: '#E5E4E0',
          strong: '#D4D3CE',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 1px 3px rgba(26, 26, 26, 0.06), 0 1px 2px rgba(26, 26, 26, 0.04)',
        card: '0 2px 8px rgba(26, 26, 26, 0.06)',
      },
    },
  },
  plugins: [],
};
