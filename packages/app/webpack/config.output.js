const path = require("path");

module.exports = (config, isDev) => {
  const { output } = config.paths;
  const { lib } = config.options;

  const outputPath = path.resolve(output);
  let result = {
    filename: isDev ? "[name].[hash].js" : "[name].[contenthash].js",
    path: outputPath,
    chunkFilename: isDev ? "[name].[hash].js" : "[name].[contenthash].js",
    publicPath: "/",
  };

  if (lib)
    result = Object.assign({}, result, {
      library: lib,
      libraryExport: "defalut",
      libraryTarget: "umd",
    });

  return result;
};
