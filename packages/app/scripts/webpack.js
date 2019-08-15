/* eslint no-console:0 */

const webpack = require("webpack");
const { deepAssign } = require("@plume/helper");

const dev = async (config, output, port, hashRouter, proxy) => {
  const WebpackDevServer = require("webpack-dev-server");
  const defaultDevOpts = {
    hot: true,
    compress: true,
    contentBase: output,
    host: "0.0.0.0",
    historyApiFallback: hashRouter ? false : true,
  };
  if (proxy) {
    if (typeof proxy === "string") {
      proxy = {
        "*": proxy,
      };
    }

    proxy.changeOrigin = true;
    defaultDevOpts.proxy = proxy;
  }
  const devOptions = deepAssign(defaultDevOpts, config.devServer);

  WebpackDevServer.addDevServerEntrypoints(config, devOptions);
  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, devOptions);

  server.listen(port, "0.0.0.0", () => {
    console.log(`Starting server on http://0.0.0.0:${port}`);
  });
};

const run = compiler => {
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err.stack || err);
        if (err.details) {
          reject(err.details);
        }
      }

      if (stats) {
        const info = stats.toJson({
          stats: "errors-only",
        });

        if (stats.hasErrors()) {
          reject(info.errors);
        }

        if (stats.hasWarnings()) {
          console.warn(info.warnings);
        }

        resolve();
      }
    });
  });
};

const setAlias = (config, alias) => {
  config.resolve.alias = alias;
};

module.exports = async (config, isDev) => {
  const { paths, options } = config;
  const { dll, hashRouter, webpack: customWebpack, port, proxy, alias } = options;
  const { output } = paths;

  try {
    if (isDev) {
      let webpackConfig = require("../webpack/webpack.config")(config, isDev);
      webpackConfig = customWebpack ? customWebpack(webpackConfig, config) : webpackConfig;
      setAlias(webpackConfig, alias);
      await dev(webpackConfig, output, port, hashRouter, proxy);
    } else {
      if (dll) {
        const dllOptions = require("../webpack/webpack.dll")(config);
        const dllCompiler = webpack(dllOptions);
        await run(dllCompiler);
      }
      let webpackConfig = require("../webpack/webpack.config")(config, isDev);
      setAlias(webpackConfig, alias);
      webpackConfig = customWebpack ? customWebpack(webpackConfig, config) : webpackConfig;

      const compiler = webpack(webpackConfig);
      await run(compiler);
    }
  } catch (error) {
    throw new Error(error);
  }
};
