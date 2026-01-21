/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
            DEFAULT: '#FF2E00', // Signal Red / Aura Red
            50: '#FFF1F0',
            100: '#FFE4E1',
            200: '#FFC9C2',
            300: '#FFAFA3',
            400: '#FF7B66',
            500: '#FF2E00',
            600: '#DB2600',
            700: '#B81F00',
            800: '#941900',
            900: '#7A1400',
        },
        'studio-white': '#FFFFFF',
        'off-white': '#F9FAFB',
        'onyx': '#111111',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'glow-trace': 'glowTrace 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glowTrace: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 46, 0, 0.2), inset 0 0 5px rgba(255, 46, 0, 0.1)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 46, 0, 0.5), inset 0 0 10px rgba(255, 46, 0, 0.2)' },
        },
        float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
