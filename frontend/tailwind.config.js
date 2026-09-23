/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B132B',       // Deep Navy Command Base
          card: '#1C2541',       // Elevated Panel Navy
          accent: '#3A506B',     // Slate Steel Accent
          teal: '#00A896',       // Institutional Teal Highlight
          gold: '#F4A261',       // Exposure / Escalation Gold
          alert: '#E63946',      // Critical Alert Red
          text: '#E0E1DD',       // High Contrast Text
          muted: '#8D99AE'       // Secondary Text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
