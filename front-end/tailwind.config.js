/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kumbh Sans'],
      },
      animation: {
        fadeIn: 'fadeIn 0.8s ease-out forwards',
        moveUp: 'moveUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        moveUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      colors: {
        'primary': {
          '0': '#D9D9D9',
          '100': '#979797',
          '200': '#A5A5A5',
          '300': '#393939',
          '400': '#535353',
          '500': '#595959',
          '600': '#242424',
          '800': '#262626',
          '900': '#1E1E1E'
        },
        'secondary': {
          '100': '#D0CAC2',
          '200': '#A4978A',
          '400': '#595149',
          '600': '#3A3027',
          '700': '#7E7575'
        }
      }
    },
  },
  plugins: [],
}
