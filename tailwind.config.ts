import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    extend: {
      colors: {
        // Bảng màu "vở ô ly": giấy, kẻ ô, mực, chì, bút đỏ chấm bài
        paper: '#F8F9FB',
        paperdeep: '#EEF1F7',
        grid: '#DCE4F0',
        ink: '#14224F',
        graphite: '#5B6478',
        mark: '#E24A26',
        solve: '#0E8F7E',
        highlight: '#F5C518',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        reading: '68ch',
      },
      backgroundImage: {
        // Nền ô ly: hai lớp đường kẻ mảnh
        grid: `linear-gradient(to right, var(--grid-line) 1px, transparent 1px),
               linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)`,
      },
      backgroundSize: {
        grid: '24px 24px',
      },
    },
  },
  plugins: [],
};

export default config;
