/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neutral ramp shared by both themes (values switch via CSS vars)
        surface: {
          0: 'var(--gimp-surface-0)',
          1: 'var(--gimp-surface-1)',
          2: 'var(--gimp-surface-2)',
          3: 'var(--gimp-surface-3)',
        },
        line: 'var(--gimp-line)',
        ink: {
          base: 'var(--gimp-ink)',
          muted: 'var(--gimp-ink-muted)',
          faint: 'var(--gimp-ink-faint)',
        },
        accent: {
          DEFAULT: 'var(--gimp-accent)',
          soft: 'var(--gimp-accent-soft)',
          ink: 'var(--gimp-accent-ink)',
        },
        ok: 'var(--gimp-ok)',
        warn: 'var(--gimp-warn)',
        err: 'var(--gimp-err)',
      },
      fontFamily: {
        ui: [
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
