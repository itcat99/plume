const TerserPlugin = require("terser-webpack-plugin");

const opt = {
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
};

module.exports = isDev =>
  Object.assign(
    {},
    opt,
    !isDev && {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          exclude: /node_modules/,
          terserOptions: {
            compress: {
              drop_console: true,
              warnings: false,
              drop_debugger: true,
            },
          },
        }),
      ],
    },
  );
