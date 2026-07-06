/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        stellar: {
          dark: "#0B0D17",
          purple: "#7B61FF",
          blue: "#3E8EFF",
        },
      },
    },
  },
  plugins: [],
};
