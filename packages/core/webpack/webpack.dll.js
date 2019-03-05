const path = require("path");
const webpack = require("webpack");
const CleanPlugin = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { getCleanPluginOpts } = require("../scripts/helper");

module.exports = config => {
  const { options, paths } = config;
  const { plume, output } = paths;
  const { dllVendor: vendor, dllName, gzip } = options;

  const { dir, root } = getCleanPluginOpts(output);

  const plugins = [
    new CleanPlugin([`${dir}/*.*`], {
      root,
    }),
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
