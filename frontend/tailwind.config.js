/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Royal Indian Heritage Theme — Imperial Maroon palette
        primary: {
          50: '#fdf2f2',
          100: '#fce4e4',
          200: '#f9c2c2',
          300: '#f49090',
          400: '#ec5454',
          500: '#580000', // Imperial Maroon — brand primary
          600: '#4a0000',
          700: '#380000',
          800: '#280000',
          900: '#1a0000',
        },
        secondary: {
          50: '#FCF5E5', // Parchment
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#1a1a1a', // Deep Charcoal
        },
        accent: {
          50: '#fef9e7',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#D4AF37', // Antique Gold
          600: '#b38728',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        // Special heritage colors
        parchment: {
          light: '#FCF5E5',
          DEFAULT: '#FCF5E5',
          dark: '#f5ead5',
        },
        ivory: {
          DEFAULT: '#FFFFF0',
        },
        charcoal: {
          DEFAULT: '#1a1a1a',
        },
        gold: {
          light: '#fcf6ba',
          DEFAULT: '#D4AF37',
          dark: '#b38728',
        },
        crimson: {
          light: '#720e0e',
          DEFAULT: '#580000',
          dark: '#4a0000',
        }
      },
      fontFamily: {
        // Royal Heritage Fonts
        playfair: ['Playfair Display', 'serif'],  // For hero titles — dramatic serif
        display: ['Cinzel', 'serif'],             // For subheadings — stone-carved feel
        serif: ['Lora', 'serif'],               // For body text — elegant manuscript
        sans: ['Inter', 'sans-serif'],         // For UI elements — clean modern
        royal: ['Cinzel', 'serif'],             // Alias for special titles
        cinzel: ['Cinzel', 'serif'],             // Explicit Cinzel class
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
