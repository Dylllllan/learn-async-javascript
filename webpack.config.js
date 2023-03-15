/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                    loader: "html-loader",
                    options: {
                        minimize: true,
                        esModule: false
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    "babel-loader"
                ],
            },
            {
                test: /\.(png|jpg|jpeg|svg|gif|webp)$/,
                type: "asset/resource",
                // Output files to the images directory
                generator: {
                    filename: "images/[name][ext]"
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: "asset/resource",
                // Output files to the fonts directory
                generator: {
                    filename: "fonts/[name][ext]"
                }
            },
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                // { from: "src/images", to: "images" },
                { from: "src/lessons", to: "lessons", globOptions: { ignore: ["**/*.js"] } },
            ],
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: true,
        })
    ]
};
