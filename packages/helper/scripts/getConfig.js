const path = require("path");
const deepAssign = require("./deepAssign");
const isExist = require("./isExist");

/**
 * 获取配置文件信息 如果没有发现配置文件 则
 * @param {string} configFilePath 手动指定的配置文件路径
 * @param {string} mode 获取配置的模式
 * @param {string} cwd 当前路径 默认为process.cwd()
 * @param {object} 输出配置对象
 */
module.exports = (configFilePath, cwd = process.cwd()) => {
  let configFile = "";
  if (configFilePath) {
    configFile = path.isAbsolute(configFilePath)
      ? configFilePath
      : path.resolve(cwd, configFilePath);
  } else {
    configFile = path.resolve(cwd, "plume.config.js");
  }
  if (isExist(configFile)) {
    const { mode } = require(configFile);
    return deepAssign(require("@plume/config")(mode), require(configFile));
  }

  throw new Error(
    "Please make sure that there is a [plume.config.js] file in the root directory of the project and the [mode] option is configured. Or specify the [plume.config.js] file path.",
  );
};
