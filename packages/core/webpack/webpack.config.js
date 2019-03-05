const common = require("./webpack.common");

module.exports = (config, isDev) => {
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
    },
  );
};
