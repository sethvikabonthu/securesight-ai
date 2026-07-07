/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          navy: '#0F172A',
          dark: '#030712',
          card: 'rgba(15, 23, 42, 0.4)',
          blue: '#2563EB',
          cyan: '#06B6D4',
          lightCyan: '#22D3EE',
          gray: '#E5E7EB',
          textMuted: '#9CA3AF',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      },
      backgroundImage: {
        'cyber-gradient': 'radial-gradient(circle at top, #1E293B 0%, #0F172A 100%)',
        'glow-gradient': 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 80%)',
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'glow-blue': '0 0 15px rgba(37, 99, 235, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
