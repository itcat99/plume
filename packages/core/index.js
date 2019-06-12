const path = require("path");
const { getConfig, task } = require("@plume/helper");
const createDir = require("./scripts/create.dir");
const createPackage = require("./scripts/create.package");
const initGit = require("./scripts/init.git");
const createGitignore = require("./scripts/create.gitignore");
const createEslint = require("./scripts/create.eslint");
const createPlumeConfig = require("./scripts/create.plumeConfig");

const root = process.cwd();
const src = path.join(root, "src");
const output = path.join(root, "dist");
const assets = path.join(output, "assets");

class Core {
  static config = {
    mode: null,
    paths: {
      root,
      src,
      output,
      assets,
    },
    options: {
      port: 8080,
      cssMode: "css",
      styledComponents: false,
      cssModules: false,
    },
  };

  static dependents = null;

  initial(opts) {
    const { name, targetPath, flow, eslint, jest, mode } = opts;
    const projectPath = path.join(targetPath, name);

    this.task("create directory", createDir(projectPath, mode, flow));
    this.task("create package.json", createPackage(name, projectPath, eslint, jest, mode));
    this.task("initial git", initGit(projectPath));
    this.task("create gitignore", createGitignore(projectPath));
    eslint && this.task("create eslint", createEslint(projectPath));
    this.task("create plume.config.js", createPlumeConfig({ projectPath, ...opts }));
  }

  dev(config) {}
  build(config) {}
  registerCli() {}
  task(...args) {
    return task(...args);
  }
  getConfig(configPath, cwd) {
    return getConfig(configPath, cwd);
  }
}

module.exports = Core;
