const task = require("../scripts/task");
const installDependents = require("../scripts/installDependents");

/**
 * 安装不同模式下的相应的依赖
 *
 * @param {object} config
 * @param {string} config.projectPath 项目目录
 * @param {array} config.dependents 依赖的数组
 * @param {array} config.devDependents 开发依赖的数组
 */
module.exports = async opts => {
  const { projectPath, dependents, devDependents } = opts;
  try {
    await task("install dependents", installDependents(projectPath, dependents));
    if (devDependents.length)
      await task("install devDependents", installDependents(projectPath, devDependents, true));
  } catch (error) {
    throw new Error(error);
  }
};
