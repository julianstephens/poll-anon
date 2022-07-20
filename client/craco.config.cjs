const path = require("path");
module.exports = {
    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    webpack: {
        alias: {
            '@common': path.resolve(__dirname, "src/common/"),
            '@components': path.resolve(__dirname, "src/components/"),
            '@fragments': path.resolve(__dirname, "src/graphql/fragments/"),
            '@assets': path.resolve(__dirname, "src/assets/")
        }
    }
}