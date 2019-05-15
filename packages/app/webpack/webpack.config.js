const common = require("./webpack.common");

module.exports = (config, isDev) => {
  const plugins = require("./config.plugins")(config, isDev);
  const rules = require("./config.rules")(config, isDev);
  const optimization = require("./config.optimization")(isDev);
  const { externals } = config.options;

  return Object.assign(
    {},
    common(config, isDev),
    {
      mode: "production",
      module: {
        rules,
      },
      externals,
      optimization,
      plugins,
    },
    isDev && {
      mode: "development",
      devtool: "source-map",
    },
  );
};
