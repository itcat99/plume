const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { path } = require("@plume/helper");

module.exports = config => {
  const { paths, options } = config;
  const { src, output } = paths;
  const { cssModules, externals, assetsExt, name } = options;

  const result = {
    mode: "production",
    entry: path.join(src, "index.js"),
    output: {
      path: path.join(output, "umd"),
      filename: "index.js",
      libraryTarget: "umd",
      library: name || "PlumeLib",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: "babel-loader?cacheDirectory",
              options: require("../scripts/babel")("umd"),
            },
          ],
        },
        {
          test: /\.(sass|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: cssModules,
              },
            },
            "sass-loader",
          ],
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: cssModules,
              },
            },
            "less-loader",
          ],
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: cssModules,
              },
            },
          ],
        },
        {
          test: new RegExp(`.(${assetsExt.join("|")})$`),
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: path.relative(output, "umd", "assets"),
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".scss", ".css", ".less"],
      modules: ["node_modules"],
    },
    externals,
    plugins: [
      new MiniCssExtractPlugin({
        filename: "style.css",
      }),
    ],
  };

  return result;
};
