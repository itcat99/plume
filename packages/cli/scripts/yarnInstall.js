const { task, spawn } = require("@plume/helper");

/**
 * 安装不同模式下的相应的依赖
 *
 * @param {object} config
 * @param {string} config.projectPath 项目目录
 * @param {array} config.prod 依赖的数组
 * @param {array} config.dev 开发依赖的数组
 */
module.exports = async opts => {
  const { projectPath, prod, dev } = opts;
  console.log("opts: ", opts);
  try {
    await task(
      "install dependents",
      spawn("yarn", [].concat(["add"], prod), {
        cwd: projectPath,
        print: false,
      }),
    );
    if (dev.length)
      await task(
        "install devDependents",
        spawn("yarn", [].concat(["add", "-D"], dev), {
          cwd: projectPath,
          print: false,
        }),
      );
  } catch (error) {
    throw new Error(error);
  }
};
