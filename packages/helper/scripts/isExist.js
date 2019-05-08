const { statSync } = require("fs-extra");

/**
 * 检查文件/文件夹是否存在
 * @param {string} targetPath 目标文件路径
 * @param {boolean} 返回true or false
 */
module.exports = targetPath => {
  try {
    statSync(targetPath);
    return true;
  } catch (error) {
    return false;
  }
};
