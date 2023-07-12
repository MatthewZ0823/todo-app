import daisyui from "daisyui"

export default {
  plugins: [daisyui],
    theme: {
    extend: {
      animation: {
        wiggle: 'wiggle 0.2s infinite',
        grow: 'grow 0.2s forwards',
        glow: 'glow 0.2s forwards'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        grow: {
          '100%': { transform: 'scale(1.1)' }
        },
        glow: {
          '100%': { boxShadow: '0 0 5px 2px #93C5FD' }
        }
      }
    },
  },
  content: ["./index.html",'./src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {},
  },
  media: false, // or 'media' or 'class'
}