/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        device: "calc(100vh - 63px)"
      }
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}

