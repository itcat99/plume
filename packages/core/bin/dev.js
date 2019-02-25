const { getConfig } = require("../helper");

module.exports = configFilePath => {
  const config = getConfig(configFilePath);

  console.log("config: ", config);
};
