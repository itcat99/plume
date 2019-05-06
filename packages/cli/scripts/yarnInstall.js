const task = require("../scripts/task");
const installDependents = require("../scripts/installDependents");

/**
 * 安装不同模式下的相应的依赖
 *
 * @param {object} config
 * @param {string} config.projectPath 项目目录
 * @param {boolean} config.flow 是否启用 plumeFlow
 * @param {boolean} config.eslint 是否启用 eslint
 * @param {boolean} config.jest 是否启用jest
 * @param {string} config.mode 模式
 * @param {string} config.cssMode css模式
 * @param {boolean} config.cssModules 是否启用cssModules
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
