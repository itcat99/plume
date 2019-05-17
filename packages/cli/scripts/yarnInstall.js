const { task, spawn } = require("@plume/helper");

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
    await task(
      "install dependents",
      spawn("yarn", [].concat(["add"], dependents), {
        cwd: projectPath,
        print: false,
      }),
    );
    if (devDependents.length)
      await task(
        "install devDependents",
        spawn("yarn", [].concat(["add", "-D"], devDependents), {
          cwd: projectPath,
          print: false,
        }),
      );
  } catch (error) {
    throw new Error(error);
  }
};
