/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{ts,tsx}"
    ],
    purge: {
        enabled: true,
        content: [
            '.src/**/*.{ts,tsx,css}'
        ]
    },
    theme: {
        fontFamily: {
            'source': ["Source Sans Pro", "sans-serif"],
        },
        extend: {
            fontFamily: {
                source: ["Source Sans Pro", "sans-serif"]
            },
            colors: {
                deepPurple: "#1A1B2F",
                lightGreen: "#1AE19A",
                softOrange: "#FE9789",
                softPink: "#FA71D1",
                gold: "#EDD568",
                fuschia: "#C46CD7",
            }
        },
    },
    plugins: [],
}