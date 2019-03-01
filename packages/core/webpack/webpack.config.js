const common = require("./webpack.common");

module.exports = (config, isDev) => {
  const { paths, options } = config;
  const { output } = paths;
  const { port } = options;

  const plugins = require("./config.plugins")(config, isDev);
  const rules = require("./config.rules")(isDev);
  const optimization = require("./config.optimization")(isDev);

  return Object.assign(
    {},
    common(config, isDev),
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
    },
  );
};
