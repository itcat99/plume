const path = require("path");
const htmlPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CleanPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HappyPack = require("happypack");
const optimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const fse = require("fs-extra");

const plugins = [];

module.exports = (config, isDev) => {
  const { paths, options } = config;
  const { plume } = paths;
  const { dll, dllName, output } = options;

  if (isDev) {
    plugins.push(
      // new webpack.HotModuleReplacementPlugin(),
      new htmlPlugin({
        template: path.resolve(__dirname, "./index.hbs"),
        title: "development mode",
      }),
    );

    return plugins;
  }

  let dllVendorName = null;
  if (dll)
    dllVendorName = (() => {
      const reg = new RegExp(`^${dllName}.dll..*.js$`);
      const dllVendorName = fse
        .readdirSync(plume)
        .toLocaleString()
        .split(",")
        .filter(item => item.match(reg))[0];

      return dllVendorName;
    })();

  plugins.push(
    new htmlPlugin({
      template: path.resolve(__dirname, "./index.hbs"),
      title: "production",
      dll: dllVendorName,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css",
    }),
    new optimizeCssAssetsPlugin(),
    new HappyPack({
      loaders: ["babel-loader?cacheDirectory"],
    }),
    new CleanPlugin(output, {
      exclude: [dllVendorName, `${dllVendorName}.gz`],
    }),
    new BundleAnalyzerPlugin(),
  );

  config.gzip &&
    plugins.push(
      new CompressionPlugin({
        test: /\.(js|jsx|css|scss|less)?$/,
        threshold: 1024 * 10, // gzip 10kb+ modules
      }),
    );

  config.dll &&
    plugins.push(
      new webpack.DllReferencePlugin({
        // context: process.cwd(), // 跟dll.config里面DllPlugin的context一致
        manifest: require(path.join(plume, "vendor-manifest.json")),
      }),
    );

  return plugins;
};
