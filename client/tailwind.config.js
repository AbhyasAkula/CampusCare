/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8'
        },
        surface: '#FFFFFF',
        brandText: {
          DEFAULT: '#0F172A',
          muted: '#64748B'
        },
        brandBorder: '#E2E8F0',
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444'
        }
      }
    },
  },
  plugins: [],
};
