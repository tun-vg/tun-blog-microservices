/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.toggle-checkbox:checked': {
          right: '0',
          borderColor: '#68D391',
          backgroundColor: '#68D391',
        },
        '.toggle-label': {
          display: 'block',
          overflow: 'hidden',
          cursor: 'pointer',
          borderRadius: '9999px',
          borderColor: '#ccc',
          borderStyle: 'solid',
          borderWidth: '2px',
          backgroundColor: '#ccc',
        },
        '.toggle-checkbox': {
          top: '0',
          left: '0',
          right: 'unset',
          bottom: '0',
          height: '24px',
          width: '24px',
          borderRadius: '9999px',
          transition: 'all 0.3s ease-in-out',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
