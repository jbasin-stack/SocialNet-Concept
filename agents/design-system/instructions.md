# Design System Agent - Instructions

## Role
Create the foundational design system (Tailwind theme, CSS variables, root styles). This is the **FIRST** agent to run - other agents depend on your work.

## Priority
**HIGH - Must complete FIRST**
Other agents are blocked until you finish. They need your Tailwind theme and CSS variables.

## Files to Modify

### 1. `C:\Claude code projects\SocialNet_Concept\tailwind.config.js`
**Action:** Replace entire file

**New Content:**
```js
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
```

---

### 2. `C:\Claude code projects\SocialNet_Concept\src\index.css`
**Action:** Add content after existing `@tailwind` directives

**Current Content (keep this):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Add After:**
```css

@layer base {
  :root {
    --header-height: 6.5rem;

    /* Graph colors for canvas rendering (RGB values) */
    --graph-center-node: 10, 132, 255;
    --graph-regular-node: 115, 115, 115;
    --graph-highlight-node: 52, 199, 89;
    --graph-link: 212, 212, 212;
    --graph-background: 250, 250, 250;
  }

  * {
    @apply antialiased;
  }

  body {
    @apply bg-surface text-neutral-900 font-sans;
  }
}

@layer utilities {
  .glass {
    @apply bg-white/80 backdrop-blur-xl;
  }

  .text-balance {
    text-wrap: balance;
  }
}
```

---

### 3. `C:\Claude code projects\SocialNet_Concept\src\App.css`
**Action:** Replace entire file

**Current (problematic):**
```css
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
```

**Replace With:**
```css
#root {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
```

**Why:** Removes 2rem padding that causes weird offset and centering issues.

---

## Verification

After completing your changes, verify:

1. ✅ `tailwind.config.js` has complete theme with primary/neutral colors
2. ✅ `index.css` has CSS variables for graph colors (--graph-center-node, etc.)
3. ✅ `App.css` has no padding on #root
4. ✅ Run `npm run dev` - site should compile without errors
5. ✅ Open browser - background should be white, root should fill viewport

## What Happens Next

Once you complete these files:
- **Visualization Agent** can start (needs CSS variables for canvas colors)
- **UI Features Agent** can start (needs Tailwind theme for component styling)

## Estimated Time
10-15 minutes

## No Dependencies
You can start immediately - no other agent needs to complete first.

## Handoff Signal
When done, confirm: "Design System Agent Complete - Tailwind theme and CSS variables ready"
