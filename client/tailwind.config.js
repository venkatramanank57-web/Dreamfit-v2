// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         couture: ['"Cormorant Garamond"', 'serif'],
//       },
//     },
//   },
//   plugins: [],
// }



// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 📱 Mobile responsive screens
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      
      // 🎨 Custom fonts
      fontFamily: {
        'couture': ['"Cormorant Garamond"', 'serif'],
        'playfair': ['"Playfair Display"', 'serif'],
        'great-vibes': ['"Great Vibes"', 'cursive'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      
      // 🎨 Custom colors
      colors: {
        'dreamfit': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      
      // 📏 Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // 🎨 Animations
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      
      // 🎬 Keyframes
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      
      // 📦 Box shadow
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        'hover': '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
      },
      
      // 📱 Mobile specific utilities
      maxWidth: {
        'mobile': '428px',
        'tablet': '768px',
        'desktop': '1280px',
      },
      
      // 📏 Height
      height: {
        'screen-90': '90vh',
        'screen-80': '80vh',
      },
      
      // 📏 Width
      width: {
        'screen-90': '90vw',
        'screen-80': '80vw',
      },
      
      // 🔤 Typography
      fontSize: {
        'xxs': '0.625rem',
        'tiny': '0.75rem',
      },
      
      // 🔲 Border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      // 🕒 Transition
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      
      // 🔄 Transition timing
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  
  // 🧩 Plugins (add if needed)
  plugins: [
    // require('@tailwindcss/forms'), // Uncomment if installed
    // require('@tailwindcss/typography'), // Uncomment if installed
    // require('@tailwindcss/aspect-ratio'), // Uncomment if installed
  ],
  
  // ⚡ Important for production
  future: {
    hoverOnlyWhenSupported: true,
  },
}