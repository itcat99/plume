const fse = require("fs-extra");
const path = require("path");
const DEFAULT_CONFIG = require("../config/plume.config");

/**
 * 获取配置文件信息
 * @param {string} configFilePath 手动指定的配置文件路径
 * @param {object} 输出配置对象
 */
const getConfig = configFilePath => {
  let config;
  const configFile = configFilePath
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

/**
 * 检查文件/文件夹是否存在
 * @param {string} targetPath 目标文件路径
 * @param {boolean} 返回true or false
 */
const hasBeing = targetPath => {
  try {
    fse.statSync(targetPath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 获取两个路径间的相对位置 (a, b) -> b路径相对于a的位置
 * @param {*} a 当前的路径
 * @param {*} b 目标路径
 */
const relativePostion = (a, b) => {
  const p1 = a.split("/");
  const p2 = b.split("/");
  let tempIndex = 0;
  let result = "";

  for (let i = 0; i < p1.length; i++) {
    if (p1[i] === p2[i]) {
      tempIndex = i;

      if (i === p1.length - 1) {
        result = `./${p2.slice(tempIndex).join("/")}`;

        return result;
      }
    } else {
      result += "../";
    }
  }

  return `${result}${p2.slice(tempIndex + 1).join("/")}`;
};

const getCleanPluginOpts = outPath => {
  const pathArr = outPath.trim().split("/");
  const dir = pathArr[pathArr.length - 1];
  const root = pathArr.slice(0, pathArr.length - 1).join("/");

  return { dir, root };
};

exports.getCleanPluginOpts = getCleanPluginOpts;
exports.getConfig = getConfig;
exports.hasBeing = hasBeing;
exports.relativePostion = relativePostion;
