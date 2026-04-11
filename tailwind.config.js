/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        h4k: {
          primary:   '#A1499A',
          secondary: '#25D366',
          bg:        '#D3E9E9',
          highlight: '#4DD9D5',
          footer:    '#262626',
          dark:      '#1A1A1A',
        },
      },
      fontFamily: {
        fredoka: ['"Fredoka One"', 'cursive'],
        rubik:   ['"Rubik"', 'sans-serif'],
        varela:  ['"Rubik"', 'sans-serif'],
        assistant: ['"Rubik"', 'sans-serif'],
      },
      borderRadius: {
        pill: '50px',
      },
    },
  },
  plugins: [],
};
