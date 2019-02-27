const { getConfig, checkDir } = require("../scripts/helper");
const init = require("../scripts/init");
const webpack = require("../scripts/webpack");

module.exports = configFilePath => {
  const config = getConfig(configFilePath);
  const { plume } = config.paths;

  if (checkDir(plume)) {
    webpack(config, "development");
  } else {
    init(config);
  }
};
