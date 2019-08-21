const path = require("path");

module.exports = (config, isDev) => {
  const { output } = config.paths;
  const { publicPath } = config.options;

  const outputPath = path.resolve(output);
  let result = {
    filename: isDev ? "[name].[hash].js" : "[name].[contenthash].js",
    path: outputPath,
    chunkFilename: isDev ? "[name].[hash].js" : "[name].[contenthash].js",
    publicPath: isDev ? "/" : publicPath,
  };

  return result;
};
