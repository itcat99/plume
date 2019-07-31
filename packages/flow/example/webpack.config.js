const { path } = require("@plume/helper");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: path.resolve(__dirname, "index.jsx"),
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dest"),
    publicPath: "/",
  },
  devServer: {
    port: 8088,
    hot: true,
    contentBase: path.resolve(__dirname),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        loader: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".scss", ".css", ".html"],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
  ],
};
