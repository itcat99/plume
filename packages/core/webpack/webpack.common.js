const path = require("path");
module.exports = config => {
  const { options, paths } = config;
  const { output, src } = paths;
  const { model } = options;

  const entry = {
    main: path.resolve(__dirname, "..", "src", model ? "index.model.jsx" : "index.jsx"),
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
      modules: [path.join(src, "node_modules")],
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
