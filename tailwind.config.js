/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#000042',
                secondary: '#667eea',
                accent: '#764ba2',
            },
        },
    },
    plugins: [],
}
