const { getConfig, isExist } = require("../scripts/helper");
const webpack = require("../scripts/webpack");

module.exports = configFilePath => {
  const config = getConfig(configFilePath);
  const { plume } = config.paths;

  if (!isExist(plume)) {
    require("./init")(configFilePath);
  }

  /* eslint no-console:0 */
  webpack(config, "production").catch(err => console.log(`[WEBPACK BUILD ERROR] ==> ${err}`));
};
