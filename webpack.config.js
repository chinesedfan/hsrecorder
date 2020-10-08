'use strict';

const path = require('path');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;

module.exports = {
    entry: {
        bundle: './src/pages/entry.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist',
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.less$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                },
                'less-loader'
            ]
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    resolve: {
        extensions: ['.vue', '.less', '.js']
    },
    devServer: {
        contentBase: __dirname
    }
};
