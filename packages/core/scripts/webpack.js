const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");

module.exports = (config, mode) => {
  const result = require("../webpack/webpack.config")(config, mode);

  console.log("config: ", result);
};
