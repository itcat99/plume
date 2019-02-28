const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const opt = {
  runtimeChunk: "single",
  splitChunks: {
    // chunks: "all",
    // name: "common",
    // minChunks: 1,
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
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          parallel: 4,
          exclude: /node_modules/,
          uglifyOptions: {
            output: {
              comments: false,
              beautify: false,
            },
            compress: {
              drop_console: true,
              warnings: false,
              drop_debugger: true,
            },
          },
        }),
      ],
    }
  );
