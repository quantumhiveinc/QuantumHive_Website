module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      animation: {
        marquee: 'marquee 30s linear infinite', // Horizontal scroll
        'scroll-down': 'scroll-down 20s linear infinite', // Vertical scroll down (20s)
        'scroll-up': 'scroll-up 20s linear infinite', // Vertical scroll up (20s)
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // Assumes horizontal content is duplicated once
        },
        'scroll-down': {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-100%)' }, // Animate full height of original content
        },
        'scroll-up': {
          '0%': { transform: 'translateY(-100%)' }, // Start from the end of the original content
          '100%': { transform: 'translateY(0%)' }, // Animate back to the start of the original content
        },
      },
      fontFamily: {
        sans: ['var(--font-tt-hoves-pro)', 'sans-serif'], // Set TT Hoves Pro as default sans font
      },
    },
  },
  plugins: [],
}
