/* eslint no-console:0 */
const path = require("path");

const { task, getConfig } = require("@plume/helper");
const createDir = require("../scripts/create.dir");
const createPackage = require("../scripts/create.package");
const createEslint = require("../scripts/create.eslint");
const createDocz = require("../scripts/create.docz");
const createGitignore = require("../scripts/create.gitignore");
const createPlumeConfig = require("../scripts/create.plumeConfig");
const yarnInstall = require("../scripts/yarnInstall");
const initGit = require("../scripts/initGit");
const getDependents = require("../scripts/getDependents");
const skipDependents = require("../scripts/skip");

/**
 * @param {object} opts 创建选项
 * @param {string} opts.name 项目名字
 * @param {string} opts.targetPath 项目目录
 * @param {boolean} opts.flow 是否启用 plume-flow
 * @param {boolean} opts.eslint 是否启用eslint
 * @param {boolean} opts.jest 是否启用jest
 * @param {boolean} opts.skip 是否跳过安装依赖
 * @param {string} opts.mode 项目模式 app | lib
 * @param {string} opts.cssMode css模式 sass | less | styled-components | css
 * @param {boolean} opts.cssModules 是否启用cssModules
 */
module.exports = opts => {
  const { name, targetPath, flow, eslint, jest, skip, mode, cssMode, cssModules } = opts;
  const projectPath = path.join(targetPath, name);

  task("create directory", createDir(projectPath, mode, flow));
  task("create package.json", createPackage(name, projectPath, eslint, jest, mode));
  task("initial git", initGit(projectPath));
  task("create gitignore", createGitignore(projectPath));
  eslint && task("create eslint", createEslint(projectPath));
  task(
    "create plume.config.js",
    createPlumeConfig({ mode, flow, projectPath, cssMode, cssModules }),
  );
  mode === "lib" && task("create docz config file", createDocz(projectPath, cssMode, cssModules));

  const { dependents, devDependents } = getDependents(opts);
  if (skip) {
    task("build project");
    skipDependents(dependents, devDependents, projectPath);
  } else {
    yarnInstall({ projectPath, dependents, devDependents })
      .then(() => {
        task("build project");
        process.chdir(projectPath);
        const config = getConfig();
        require("./dev")(config);
      })
      .catch(err => console.error("Install dependents error: ", err));
  }
};
