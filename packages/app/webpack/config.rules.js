const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const postcssCfg = {
  loader: "postcss-loader",
  options: {
    plugins: [require("autoprefixer")],
  },
};

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
      use: [
        isDev ? "style-loader" : MiniCssExtractPlugin.loader,
        "css-loader",
        postcssCfg,
        "sass-loader",
      ],
    },
    {
      test: /\.less?$/,
      use: [
        isDev ? "style-loader" : MiniCssExtractPlugin.loader,
        "css-loader",
        postcssCfg,
        {
          loader: "less-loader",
          options: {
            javascriptEnabled: true, // fix antd compile bug
          },
        },
      ],
    },
    {
      test: /\.css?$/,
      use: [isDev ? "style-loader" : MiniCssExtractPlugin.loader, "css-loader", postcssCfg],
    },
    {
      test: /\.hbs$/,
      use: [require.resolve("handlebars-loader")],
    },
    {
      test: new RegExp(`.(${assetsExt.join("|")})$`),
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "assets",
          },
        },
      ],
    },
  ];
};
