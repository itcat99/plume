const { getConfig, hasBeing } = require("../scripts/helper");
const webpack = require("../scripts/webpack");

module.exports = configFilePath => {
  const config = getConfig(configFilePath);
  const { plume } = config.paths;

  if (!hasBeing(plume)) {
    require("./init")(configFilePath);
  }

  webpack(config, "production");
};
