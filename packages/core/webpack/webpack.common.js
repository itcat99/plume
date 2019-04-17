const path = require("path");

module.exports = (config, isDev) => {
  const { paths } = config;
  const { plume, output } = paths;

  const entry = isDev
    ? path.join(plume, "index.jsx")
    : {
        main: path.join(plume, "index.jsx"),
      };
  const outputPath = path.resolve(output);

  return {
    entry,
    output: {
      filename: isDev ? "[name].[hash].js" : "[name].[contenthash].js",
      path: outputPath,
      chunkFilename: isDev ? "[name].[hash].js" : "[name].[contenthash].js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          loader: "babel-loader?cacheDirectory",
          exclude: /node_modules/,
        },
        {
          test: /\.scss?$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.less?$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true, // fixe antd compile bug
              },
            },
          ],
        },
        {
          test: /\.css?$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.hbs$/,
          use: ["handlebars-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".scss", ".css", ".less"],
      modules: ["node_modules"],
    },
  };
};
