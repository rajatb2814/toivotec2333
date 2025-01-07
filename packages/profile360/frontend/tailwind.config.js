/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      lato: ['Lato', 'sans-serif'],
      'sans-pro': ['Source Sans Pro', 'sans-serif'],
    },
    extend: {
      colors: {
        // 'primary-action': '#5048ED',
        'neutral-600': '#495057',
        'neutral-700': '#212429',
        'neutral-400': '#A3ABB1',

        tertiary: '#6C747D',
        'pg-active-light': '#E4F9F2',

        'pg-active-medium': '#2CBE90',
        'pg-active-dark': '#229470',
        'pg-hold-light': '#FFEFD4',
        'pg-hold-medium': '#ffa811',
        'pg-hold-dark': '#BD7701',
        'primary-border': '#DDE2E5',
        'ghost-white': '#f9fafb',
        secondary: '#F0F3F4',
        'secondary-label': '#C7CED3',
        'primary-action': '#5048ED',
      },
      boxShadow: {
        primary: '0 4px 24px  rgba(0, 0, 0, 0.16)',
        'select-dropdown': '0px 0px 50px rgba(0, 0, 0, 0.1)',
        'form-footer': '0px -8px 24px rgb(40 58 70 / 6%)',
        secondary: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        tertiary: '0px 4px 20px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
