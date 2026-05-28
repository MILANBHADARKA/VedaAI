import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E85A1F',
          light: '#F58A3A',
        },
        surface: '#FFFFFF',
        page: '#F1F0EC',
        'nav-active': '#F1E9DD',
        'banner-dark': '#1F1F1F',
        neutral: {
          100: '#F7F6F3',
          200: '#F1F0EC',
          300: '#E6E5E1',
          400: '#D6D5D0',
          500: '#9CA3AF',
          600: '#6B7280',
          900: '#1A1A1A',
        },
        success: '#22C55E',
        notification: '#E11D48',
        danger: '#E04545',
        easy: { bg: '#E6F7EC', fg: '#1F8A4C' },
        moderate: { bg: '#FFF1DB', fg: '#B5651A' },
        challenging: { bg: '#FDE4E4', fg: '#B42424' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,20,20,.04), 0 2px 8px rgba(20,20,20,.06)',
        popover:
          '0 4px 16px rgba(20,20,20,.08), 0 8px 32px rgba(20,20,20,.08)',
        button:
          '0 1px 2px rgba(0,0,0,.10), inset 0 1px 0 rgba(255,255,255,.10)',
      },
    },
  },
  plugins: [],
}

export default config
