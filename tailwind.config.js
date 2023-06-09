/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./src/**/*.{js,ts,jsx,tsx,mdx}",

  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'faded-grey': '#EFF2F5',
        'dark-grey': '#6B7280',
        'medium-grey': '#58667E',
        'news-grey': "rgb(248, 250, 253)",
        'blue-colour': "#3861FB",
        'main-color': "#222531"
      }
    },
  },
  plugins: [],
}
