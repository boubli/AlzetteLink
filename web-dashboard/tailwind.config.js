/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'alzette-blue': '#0056b3',
                'alzette-dark': '#1a1a1a',
                // Device accent palette
                'device': {
                    1: '#3b82f6', // blue
                    2: '#8b5cf6', // violet
                    3: '#06b6d4', // cyan
                    4: '#f59e0b', // amber
                    5: '#ec4899', // pink
                    6: '#10b981', // emerald
                },
            },
            animation: {
                'shimmer': 'shimmer 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.4s ease-out',
                'slide-up': 'slide-up 0.4s ease-out',
                'slide-right': 'slide-right 0.3s ease-out',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
            },
            keyframes: {
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-right': {
                    '0%': { opacity: '0', transform: 'translateX(-16px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'glow-pulse': {
                    '0%, 100%': { opacity: '0.6' },
                    '50%': { opacity: '1' },
                },
            },
            backdropBlur: {
                'xs': '2px',
            },
            boxShadow: {
                'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
                'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.2)',
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
                'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
                'glow-amber': '0 0 20px rgba(245, 158, 11, 0.3)',
                'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
            },
        },
    },
    plugins: [],
}
