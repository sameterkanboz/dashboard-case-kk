/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/**/*.tsx", "./pages/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: "#145389",
        secondary: "#363F72",
        button: "#F3F6FD",
      },
    },
  },
  plugins: [],
};
