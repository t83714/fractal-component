const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "src/main.js"),
    resolve: {
        alias: {
            "fractal-component": path.resolve(__dirname, "../../packages/core/")
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new LodashModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "index.html")
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"]
            }
        ]
    },
    devtool: "source-map",
    devServer: {
        port: 3000,
        hot: true
    }
};
