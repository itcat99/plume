const path = require("path");

module.exports = (config, isDev) => {
  const { paths } = config;
  const { plume, output } = paths;

  const entry = isDev
    ? [path.join(plume, "index.jsx")]
    : {
        main: path.join(plume, "index.jsx"),
      };
  const outputPath = path.resolve(output);

  return {
    entry,
    output: {
      filename: "[name].[hash].js",
      path: outputPath,
      chunkFilename: "[name].[hash].js",
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
          use: ["style-loader", "css-loader", "less-loader"],
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
      extensions: [".js", ".jsx", ".json"],
      modules: ["node_modules"],
    },
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /node_modules/,
            name: "common",
            chunks: "all",
          },
        },
      },
    },
  };
};
