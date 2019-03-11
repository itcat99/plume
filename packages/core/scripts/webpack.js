/* eslint no-console:0 */

const webpack = require("webpack");

const dev = async (config, output, port) => {
  const WebpackDevServer = require("webpack-dev-server");
  const devOptions = {
    hot: true,
    compress: true,
    contentBase: output,
    host: "0.0.0.0",
  };

  WebpackDevServer.addDevServerEntrypoints(config, devOptions);
  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, devOptions);

  server.listen(port, "localhost", () => {
    console.log(`Starting server on http://localhost:${port}`);
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

      const info = stats.toJson();

      if (stats.hasErrors()) {
        reject(info.errors);
      }

      if (stats.hasWarnings()) {
        reject(info.warnings);
      }

      resolve();
    });
  });
};

module.exports = async (config, mode) => {
  const isDev = mode === "development";
  const { dll, port } = config.options;
  const { output } = config.paths;

  if (dll && !isDev) {
    const dllOptions = require("../webpack/webpack.dll")(config);
    const dllCompiler = webpack(dllOptions);

    try {
      await run(dllCompiler);
      const options = require("../webpack/webpack.config")(config, isDev);
      const compiler = webpack(options);
      await run(compiler);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    const options = require("../webpack/webpack.config")(config, isDev);

    if (isDev) {
      try {
        await dev(options, output, port);
        console.log("> SUCCESSED!");
      } catch (error) {
        throw new Error(error);
      }
    } else {
      try {
        const compiler = webpack(options);
        await run(compiler);
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
