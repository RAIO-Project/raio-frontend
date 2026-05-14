/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#08090d',
          2: '#0f1117',
          3: '#171b24',
          4: '#1e2333',
          5: '#252c3e',
        },
        accent: {
          DEFAULT: '#00e5ff',
          2: '#ff4b6e',
          green: '#00d48a',
          yellow: '#f5a623',
        },
        border: '#1f2538',
      },
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-dot': 'pulseDot 1.2s ease infinite',
        'slide-up': 'slideUp 0.25s ease',
        'fade-in': 'fadeIn 0.2s ease',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        slideUp: {
          from: { transform: 'translateY(8px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
