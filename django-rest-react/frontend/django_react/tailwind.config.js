/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      'sm': '360px',
      // => @media (min-width: 640px) { ... }

      'md': '630px',
      // => @media (min-width: 768px) { ... }

      'lg': '858px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1024px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1535px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        'black-rgba': 'rgba(0, 0, 0, 0.15)',
      },
      margin: {
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '68': '17rem',
        '70': '17.5rem',
        '72': '18rem',
        '76': '19rem',
        '80': '20rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
      },
      padding: {
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '68': '17rem',
        '70': '17.5rem',
        '72': '18rem',
        '76': '19rem',
        '80': '20rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
      },
      width: {
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '68': '17rem',
        '70': '17.5rem',
        '72': '18rem',
        '76': '19rem',
        '80': '20rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
      },
      height: {
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '68': '17rem',
        '70': '17.5rem',
        '72': '18rem',
        '76': '19rem',
        '80': '20rem',
        '84': '21rem',
        '88': '22rem',
        '92': '23rem',
        '96': '24rem',
      },
    },
  },
  plugins: [],
}
