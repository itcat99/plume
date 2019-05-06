/* eslint no-console:0 */
const path = require("path");
// const { spawn } = require("child_process");

const task = require("../scripts/task");
const mkPackage = require("../scripts/mkPackage");
const yarnInstall = require("../scripts/yarnInstall");
const createEslint = require("../scripts/createEslint");
const initGit = require("../scripts/initGit");
const initGitignore = require("../scripts/initGitignore");
const copyTemp = require("../scripts/copyTemp");
const createDocz = require("../scripts/createDocz");
const getDependents = require("../scripts/getDependents");
const skipDependents = require("../scripts/skip");

/**
 * @param {object} opts 创建选项
 * @param {string} opts.name 项目名字
 * @param {string} opts.targetPath 项目目录
 * @param {boolean} opts.flow 是否启用@plume/flow
 * @param {boolean} opts.esling 是否启用eslint
 * @param {boolean} opts.jest 是否启用jest
 * @param {boolean} opts.skip 是否跳过安装依赖
 */
module.exports = opts => {
  const { name, targetPath, flow, eslint, jest, skip, mode, cssMode, cssModules } = opts;
  const projectPath = path.join(targetPath, name);

  task("copy template", copyTemp(projectPath, mode, flow));
  task("build package.json", mkPackage(name, projectPath, eslint, jest, mode));
  task("build git", initGit(projectPath));
  task("build gitignore", initGitignore(projectPath));
  eslint && task("build eslint", createEslint(projectPath));
  mode === "lib" && task("build docz config file", createDocz(projectPath, cssMode, cssModules));

  const { dependents, devDependents } = getDependents(opts);
  if (skip) {
    task("build project");
    skipDependents(dependents, devDependents, projectPath);
  } else {
    yarnInstall({ projectPath, dependents, devDependents })
      .then(() => {
        task("build project");
        process.chdir(projectPath);
        require("./dev")(null, mode);
      })
      .catch(err => console.error("Install dependents error: ", err));
  }
};
