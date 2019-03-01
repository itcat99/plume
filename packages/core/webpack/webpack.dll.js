const path = require("path");
const webpack = require("webpack");
const CleanPlugin = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = config => {
  const { options, paths } = config;
  const { plume, output } = paths;
  const { dllVendor: vendor, dllName, gzip } = options;

  const plugins = [
    new CleanPlugin(output),
    new webpack.DllPlugin({
      path: path.join(plume, "vendor-manifest.json"),
      name: "[name]_[hash]",
    }),
  ];

  gzip &&
    plugins.push(
      new CompressionPlugin({
        test: /\.(js|jsx)?$/,
        threshold: 1024 * 10, // gzip 10kb+ modules
      }),
    );

  return {
    mode: "production",
    entry: {
      vendor,
    },
    output: {
      filename: `${dllName}.dll.[hash].js`,
      path: output,
      library: "[name]_[hash]",
      libraryTarget: "this",
      publicPath: "/",
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"],
    },
    plugins,
  };
};
