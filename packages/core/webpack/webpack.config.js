const common = require("./webpack.common");

module.exports = (config, mode) => {
  const { paths, options } = config;
  const { output } = paths;
  const { port } = options;

  console.log("mode: ", mode);
  const isDev = mode === "development";
  const plugins = require("./config.plugins")(config, isDev);
  const rules = require("./config.rules")(isDev);
  const optimization = require("./config.optimization")(isDev);

  return Object.assign(
    {},
    common,
    {
      mode: "production",
      module: {
        rules,
      },
      optimization,
      plugins,
    },
    isDev && {
      mode: "development",
      devtool: "source-map",
      devServer: {
        hot: true,
        compress: true,
        contentBase: output,
        port,
        host: "0.0.0.0",
      },
    }
  );
};
