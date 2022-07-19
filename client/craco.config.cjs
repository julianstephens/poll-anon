const path = require("path");
module.exports = {
    webpack: {
        alias: {
            '@fragments': path.resolve(__dirname, "src/fragments/"),
            '@assets': path.resolve(__dirname, "src/assets/")
        }
    }
}