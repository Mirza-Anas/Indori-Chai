/** @type {import('tailwindcss').Config} */
module.exports = {
  // Configure the paths to all of your template files that contain Tailwind class names
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // Add any other paths specific to your project here (e.g. index.html)
    './src/**/*.{html,js}', 
  ],
  theme: {
    // Extend the default theme with your custom values (colors, spacing, fonts, etc.)
    extend: {},
  },
  // Add official or custom plugins here
  plugins: [],
};