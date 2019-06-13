/* eslint no-console:0 */
const { task, getConfig } = require("@plume/helper");
const skipDependents = require("../scripts/skip");
const yarnInstall = require("../scripts/yarnInstall");

/**
 * @param {object} opts 创建选项
 * @param {string} opts.name 项目名字
 * @param {string} opts.projectPath 项目目录
 * @param {boolean} opts.flow 是否启用 plume-flow
 * @param {boolean} opts.eslint 是否启用eslint
 * @param {boolean} opts.jest 是否启用jest
 * @param {boolean} opts.skip 是否跳过安装依赖
 * @param {string} opts.mode 项目模式 app | lib
 * @param {string} opts.cssMode css模式 sass | less | css | none
 * @param {boolean} opts.cssModules 是否启用cssModules
 * @param {boolean} opts.styledComponents 是否启用styled-components
 */
module.exports = (opts, instance) => {
  const { mode, skip, projectPath } = opts;
  if (!instance) {
    const Mode = require("../scripts/getMode")(mode);
    instance = new Mode(projectPath);
  }

  instance.initial(opts);
  const { dev, prod } = instance.dependents(opts);
  if (skip) {
    task("build project");
    skipDependents(prod, dev, projectPath);
  } else {
    yarnInstall({ projectPath, prod, dev })
      .then(() => {
        task("build project");
        process.chdir(projectPath);

        require("./dev")(getConfig(), instance);
      })
      .catch(err => console.error("Install dependents error: ", err));
  }
};
