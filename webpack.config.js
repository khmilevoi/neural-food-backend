const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

dotenv.config();

module.exports = {
  entry: "./src/index.ts",
  mode: "development",
  target: "node",
  devtool: "source-map",
  output: {
    filename: `[name].js`,
    chunkFilename: `[name].js`,
    publicPath: "/",
    path: path.resolve("./dist/"),
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
    modules: ["./node_modules", "./src"].map((p) => path.resolve(p)),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        loader: "babel-loader",
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: ["babel-loader", "ts-loader"],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin({
      SERP_API: process.env.SERP_API,
      ADMINSDK: process.env.ADMINSDK,
    }),
  ],
  externals: ["commonjs2 firebase-admin"],
};
