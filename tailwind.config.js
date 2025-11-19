tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            colors: {
                'swiss-black': '#050505',
                'swiss-white': '#FAFAFA',
                'swiss-gray': '#888888'
            },
            animation: {
                'marquee': 'marquee 25s linear infinite',
                'marquee-reverse': 'marquee 25s linear infinite reverse',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        }
    }
}
