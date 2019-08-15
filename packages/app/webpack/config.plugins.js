const path = require("path");
const htmlPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HappyPack = require("happypack");
const optimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const copyPlugin = require("copy-webpack-plugin");
const webpackbar = require("webpackbar");
const webpack = require("webpack");
const fse = require("fs-extra");

const plugins = [];

module.exports = (config, isDev) => {
  const { paths, options } = config;
  const { dll, gzip, analyzer, assetsIgnore } = options;
  const { plume, output, srcAssets, assets } = paths;

  if (isDev) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new htmlPlugin({
        template: path.resolve(__dirname, "./index.hbs"),
        title: "development mode",
      }),
    );

    return plugins;
  }

  let dllVendorName = null;
  if (dll) {
    dllVendorName = (() => {
      const dllVendorName = fse
        .readdirSync(output)
        .toLocaleString()
        .split(",")
        .filter(item => item.match(/.+.dll\..+\.js+?/))[0];

      return dllVendorName;
    })();

    plugins.push(
      new webpack.DllReferencePlugin({
        // context: process.cwd(), // 跟dll.config里面DllPlugin的context一致
        manifest: require(path.join(plume, "vendor-manifest.json")),
      }),
    );
  } else {
    plugins.push(new CleanPlugin());
  }

  plugins.push(
    new copyPlugin([{ from: srcAssets, to: assets, ignore: assetsIgnore }]),
    new htmlPlugin({
      template: path.resolve(__dirname, "./index.hbs"),
      title: "production",
      dll: dllVendorName,
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].css" : "[name].[contenthash].css",
      chunkFilename: isDev ? "[name].css" : "[name].[contenthash].css",
    }),
    new optimizeCssAssetsPlugin(),
    new HappyPack({
      loaders: ["babel-loader?cacheDirectory"],
      verbose: false,
    }),
    new webpackbar(),
  );

  gzip &&
    plugins.push(
      new CompressionPlugin({
        test: /\.(js|jsx|css|scss|less)?$/,
        threshold: 1024 * 10, // gzip 10kb+ modules
      }),
    );

  analyzer && plugins.push(new BundleAnalyzerPlugin());

  return plugins;
};
