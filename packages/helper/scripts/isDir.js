const { statSync } = require("fs-extra");

/**
 * 判断是否为目录
 * @param {string} dirPath
 */
module.exports = dirPath => {
  try {
    const stat = statSync(dirPath);
    if (stat.isDirectory()) return true;
    return false;
  } catch (err) {
    return false;
  }
};
