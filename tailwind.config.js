/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{html,ts,scss}', './public/api/**/*.json'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
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
        trd: {
          obsidian: '#0b0f19',
          slate: '#111827',
          border: '#1e293b',
          cyan: '#06b6d4',
          electric: '#22d3ee',
          cyanAccessible: '#0891b2',
        },
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
        glass: '22px',
        'glass-lg': '26px',
      },
      transitionTimingFunction: {
        'ios-spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
