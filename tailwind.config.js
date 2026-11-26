/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{html,ts,scss}', './public/api/**/*.json'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Inter"',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        ink: 'var(--ink-primary)',
        secondary: 'var(--ink-secondary)',
        muted: 'var(--ink-muted)',
        accent: {
          DEFAULT: 'var(--accent-cyan)',
          strong: 'var(--accent-cyan-strong)',
          soft: 'var(--accent-cyan-soft)',
          ink: 'var(--accent-ink)',
        },
        hairline: 'var(--glass-border)',
      },
      borderRadius: {
        glass: '24px',
        'glass-lg': '28px',
      },
    },
  },
  plugins: [],
};
