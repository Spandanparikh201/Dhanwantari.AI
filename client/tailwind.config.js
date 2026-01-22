/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#052e16', // Deep Forest Green
                    light: '#0a4f2a',
                    dark: '#021a0c',
                },
                secondary: {
                    DEFAULT: '#F5F5F0', // Stone Grey
                    dim: '#e6e6e0',
                },
                accent: {
                    DEFAULT: '#00ff9d', // Neon Mint
                    glow: '#4dffbfa0',
                },
                surface: {
                    glass: 'rgba(5, 46, 22, 0.7)',
                    dark: '#021a0c',
                },
                background: '#020617', // Slate 950
                phosphor: {
                    DEFAULT: '#00ff9d', // Bright Green
                    dim: '#10b981', // Emerald 500
                    dark: '#064e3b', // Emerald 900
                    bg: '#051a14', // Very Dark Green
                }
            },
            fontFamily: {
                display: ['"Share Tech Mono"', 'monospace'],
                mono: ['"Share Tech Mono"', 'monospace'],
                body: ['"General Sans"', 'sans-serif'],
            },
            animation: {
                'slow-morph': 'morph 8s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.5s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                morph: {
                    '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
                    '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
