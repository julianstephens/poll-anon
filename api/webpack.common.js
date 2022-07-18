const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    module: {
        rules: [{
                exclude: [path.resolve(__dirname, 'node_modules')],
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(graphql|gql)$/,
                exclude: /node_modules/,
                loader: 'graphql-tag/loader',
            }
        ]
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx']
    },
    target: 'node'
};