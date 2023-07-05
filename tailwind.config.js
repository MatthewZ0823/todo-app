export default {
  plugins: [],
    theme: {
    extend: {
      animation: {
        wiggle: 'wiggle 0.2s infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
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