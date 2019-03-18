const { getConfig, isExist } = require("../scripts/helper");
const webpack = require("../scripts/webpack");

module.exports = configFilePath => {
  const config = getConfig(configFilePath);
  const { plume } = config.paths;

  if (!isExist(plume)) {
    require("./init")(configFilePath);
  }

  webpack(config, "production");
};
