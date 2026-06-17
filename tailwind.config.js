/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'studio': {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2A2A2A',
          600: '#363636',
          500: '#424242',
        },
        'accent': {
          neon: '#00FFA3',
          blue: '#00B8FF',
          warm: '#FF6B35',
        },
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 163, 0.4)',
        'neon-blue': '0 0 20px rgba(0, 184, 255, 0.4)',
        'neon-green-lg': '0 0 40px rgba(0, 255, 163, 0.3)',
      },
      backgroundImage: {
        'grid-studio': 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-studio': '40px 40px',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'waveform': 'waveform 1.5s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(0, 255, 163, 0.6)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 25px rgba(0, 255, 163, 0.2)' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.3)' },
        },
        scanLine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
      },
    },
  },
  plugins: [],
}
