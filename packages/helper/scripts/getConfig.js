const path = require("path");
const DEFAULT_CONFIG = require("@plume/config");
const deepAssign = require("./deepAssign");
const isExist = require("./isExist");

/**
 * 获取配置文件信息
 * @param {string} configFilePath 手动指定的配置文件路径
 * @param {object} 输出配置对象
 */
module.exports = configFilePath => {
  let config = DEFAULT_CONFIG;
  let configFile = "";

  if (configFilePath) {
    configFile = path.isAbsolute(configFilePath)
      ? configFilePath
      : path.resolve(process.cwd(), configFilePath);
  } else {
    const tempFile = path.resolve(process.cwd(), "plume.config.json");
    configFile = isExist(tempFile) ? tempFile : path.resolve(process.cwd(), "plume.config.js");
  }

  if (isExist(configFile)) {
    config = deepAssign(config, require(configFile));
  }

  return config;
};
