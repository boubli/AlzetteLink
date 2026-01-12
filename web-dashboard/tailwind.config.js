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
            }
        },
    },
    plugins: [],
}
