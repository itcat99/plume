const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (config, isDev) => {
  const { assetsExt } = config.options;

  return [
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
    {
      test: new RegExp(`.(${assetsExt.join("|")})?$`),
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
            outputPath: "assets",
          },
        },
      ],
    },
  ];
};
