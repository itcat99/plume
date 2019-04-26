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
  const { name, targetPath, flow, eslint, jest, skip, mode } = opts;
  const projectPath = path.join(targetPath, name);

  task("copy template", copyTemp(projectPath, mode, flow));
  task("create package.json", mkPackage(name, projectPath, eslint, jest));
  task("initial git", initGit(projectPath));
  task("initial gitignore", initGitignore(projectPath));
  eslint && task("create eslint", createEslint(projectPath));

  if (skip) {
    process.stdout.write(
      `>> You must run "yarn add react react-dom react-router-dom react-loadable @babel/runtime" to install devendents.\n`,
    );

    eslint &&
      process.stdout.write(
        `>> You must run "yarn add -D eslint babel-eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-react precise-commits prettier husky" to install devDependents.\n`,
      );
  } else {
    yarnInstall({ projectPath, flow, eslint, jest, mode })
      .then(() => {
        process.chdir(projectPath);
        require("./dev")(null, mode);
      })
      .catch(err => console.error("Install dependents error: ", err));
  }
};
