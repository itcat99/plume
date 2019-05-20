/* eslint no-console:0 */

const webpack = require("webpack");

const dev = async (config, output, port, hashRouter) => {
  const WebpackDevServer = require("webpack-dev-server");
  const devOptions = {
    hot: true,
    compress: true,
    contentBase: output,
    host: "0.0.0.0",
    historyApiFallback: hashRouter ? false : true,
  };

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

module.exports = async (config, isDev) => {
  const { paths, options } = config;
  const { dll, hashRouter, webpack: customWebpack, port } = options;
  const { output } = paths;

  try {
    if (isDev) {
      let webpackConfig = require("../webpack/webpack.config")(config, isDev);
      webpackConfig = customWebpack ? customWebpack(webpackConfig, config) : webpackConfig;
      await dev(webpackConfig, output, port, hashRouter);
    } else {
      if (dll) {
        const dllOptions = require("../webpack/webpack.dll")(config);
        const dllCompiler = webpack(dllOptions);
        await run(dllCompiler);
      }
      let webpackConfig = require("../webpack/webpack.config")(config, isDev);
      webpackConfig = customWebpack ? customWebpack(webpackConfig, config) : webpackConfig;

      const compiler = webpack(webpackConfig);
      await run(compiler);
    }
  } catch (error) {
    throw new Error(error);
  }
};
