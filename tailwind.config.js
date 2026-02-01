/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary: Apple system blue
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9ddff',
          300: '#7cc4ff',
          400: '#38a9ff',
          500: '#0a84ff',
          600: '#0066d6',
          700: '#004fb3',
          800: '#003d8f',
          900: '#002d6b',
          950: '#001a3d',
        },

        // Neutral: Warm grays
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },

        // Surface colors
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#f5f5f5',
          overlay: '#fafafa',
        },

        // Semantic colors
        success: '#34c759',
        warning: '#ff9f0a',
        error: '#ff3b30',
        info: '#0a84ff',
      },

      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
      },

      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.625rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },

      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 2px 6px 0 rgba(0, 0, 0, 0.08)',
        'DEFAULT': '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 6px 16px 0 rgba(0, 0, 0, 0.12)',
        'lg': '0 10px 24px 0 rgba(0, 0, 0, 0.15)',
        'xl': '0 16px 32px 0 rgba(0, 0, 0, 0.18)',
        'elevated': '0 8px 20px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      zIndex: {
        'header': '100',
        'dropdown': '200',
        'modal-backdrop': '999',
        'modal': '1000',
        'tooltip': '1100',
      },
    },
  },
  plugins: [],
}
