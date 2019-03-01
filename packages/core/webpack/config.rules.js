const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = isDev => [
  {
    test: /\.(js|jsx)?$/,
    loader: isDev ? "babel-loader?cacheDirectory" : "happypack/loader",
    exclude: /node_modules/,
  },
  {
    test: /\.scss?$/,
    use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
  },
  {
    test: /\.less?$/,
    use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
  },
  {
    test: /\.css?$/,
    use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader"],
  },
  {
    test: /\.hbs$/,
    use: [require.resolve("handlebars-loader")],
  },
];
