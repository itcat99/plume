const fse = require("fs-extra");
const path = require("path");
const DEFAULT_CONFIG = require("@plume/config");

/**
 * 是否为Object
 * @param {object} obj
 * @return {boolean}
 */
const isObject = obj => Object.prototype.toString.call(obj).indexOf("Object") >= 0;

/**
 * 深合并对象
 * @param {object} origin 目标对象
 * @param {object} target 要合并进去的对象
 * @return {object}
 */
const deepAssign = (origin, target) => {
  const tempObj = origin;

  for (const key in target) {
    if (isObject(origin[key]) && target[key]) {
      tempObj[key] = deepAssign(origin[key], target[key]);
    } else {
      tempObj[key] = target[key];
    }
  }

  return tempObj;
};

/**
 * 获取配置文件信息
 * @param {string} configFilePath 手动指定的配置文件路径
 * @param {object} 输出配置对象
 */
const getConfig = configFilePath => {
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

/**
 * 检查文件/文件夹是否存在
 * @param {string} targetPath 目标文件路径
 * @param {boolean} 返回true or false
 */
const isExist = targetPath => {
  try {
    fse.statSync(targetPath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 判断是否为目录
 * @param {string} dirPath
 */
const isDir = dirPath => {
  try {
    const stat = fse.statSync(dirPath);
    if (stat.isDirectory()) return true;
    return false;
  } catch (err) {
    return false;
  }
};

/**
 * 获取两个路径间的相对位置 (a, b) -> b路径相对于a的位置
 * @param {*} a 当前的路径
 * @param {*} b 目标路径
 */
const relativePostion = (a, b) => {
  if (a === b) return ".";
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

/**
 * 获取webpack clean plugin的options
 * @param {*} outPath 输出目录
 */
const getCleanPluginOpts = outPath => {
  const pathArr = outPath.trim().split("/");
  const dir = pathArr[pathArr.length - 1];
  const root = pathArr.slice(0, pathArr.length - 1).join("/");

  return {
    dir,
    root,
  };
};

const debounce = (cb, time) => {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => cb(...args), time);
  };
};

exports.debounce = debounce;
exports.isDir = isDir;
exports.deepAssign = deepAssign;
exports.isObject = isObject;
exports.getCleanPluginOpts = getCleanPluginOpts;
exports.getConfig = getConfig;
exports.isExist = isExist;
exports.relativePostion = relativePostion;
