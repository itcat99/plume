const path = require("path");
const DEFAULT_CONFIG = require("../plume.config");

const getConfig = configFilePath => {
  let config;
  configFile = configFilePath
    ? path.isAbsolute(configFilePath)
      ? configFilePath
      : path.resolve(process.cwd(), configFilePath)
    : path.resolve(process.cwd(), "plume.config.js");

  try {
    config = require(configFile);
  } catch (error) {
    config = DEFAULT_CONFIG;
  }

  return config;
};

exports.getConfig = getConfig;
