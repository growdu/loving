/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        background: 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        text: 'var(--text)',
        'text-light': 'var(--text-light)',
        card: 'var(--card-bg)',
      },
      borderRadius: {
        DEFAULT: 'var(--theme-border-radius)',
        sm: 'var(--theme-border-radius-sm)',
      },
      boxShadow: {
        DEFAULT: 'var(--theme-shadow)',
        hover: 'var(--theme-shadow-hover)',
      },
    },
  },
  plugins: [],
}