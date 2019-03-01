/* eslint no-console:0 */

const dev = async config => {
  const WebpackDevServer = require("webpack-dev-server");
  const webpack = require("webpack");

  const compiler = webpack(config);
  const devServerOptions = Object.assign({}, config.devServer, {
    quiet: true,
  });

  const server = new WebpackDevServer(compiler, devServerOptions);
  server.listen(8080, "localhost", () => {
    console.log("Starting server on http://localhost:8080");
  });
};

module.exports = (config, mode) => {
  const isDev = mode === "development";
  const options = require("../webpack/webpack.config")(config, isDev);

  if (isDev) {
    dev(options)
      .then(() => console.log("> SUCCESSED!"))
      .catch(err => console.error("> FAILD: ", err));
  } else {
    const webpack = require("webpack");
    const compiler = webpack(options);
    compiler.run(err => {
      if (err) throw new Error(err);
    });
  }
};
