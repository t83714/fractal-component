const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");

module.exports = (env, argv) => {
    const devConfig = {
        mode: "development",
        entry: path.resolve(__dirname, "src/main.js"),
        optimization: {
            splitChunks: {
                chunks: "all"
            }
        },
        performance: {
            hints: false
        },
        resolve: {
            alias: {
                "fractal-component": path.resolve(
                    __dirname,
                    "../../packages/core/"
                ),
                "@fractal-components/random-gif": path.resolve(
                    __dirname,
                    "../../examples/RandomGif/"
                ),
                "@fractal-components/random-gif-pair": path.resolve(
                    __dirname,
                    "../../examples/RandomGifPair/"
                ),
                "@fractal-components/random-gif-pair-pair": path.resolve(
                    __dirname,
                    "../../examples/RandomGifPairPair/"
                ),
                "@fractal-components/counter": path.resolve(
                    __dirname,
                    "../../examples/Counter/"
                ),
                "@fractal-components/toggle-button": path.resolve(
                    __dirname,
                    "../../examples/ToggleButton/"
                )
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
    if (argv.mode === "production") {
        devConfig.mode = argv.mode;
        delete devConfig.devServer;
        devConfig.plugins.shift();
    }
    return devConfig;
};
