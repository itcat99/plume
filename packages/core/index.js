const path = require("path");
const { getConfig, task, deepAssign } = require("@plume/helper");
const createDir = require("./scripts/create.dir");
const createPackage = require("./scripts/create.package");
const initGit = require("./scripts/init.git");
const createGitignore = require("./scripts/create.gitignore");
const createEslint = require("./scripts/create.eslint");
const createPlumeConfig = require("./scripts/create.plumeConfig");

class Core {
  constructor(rootPath) {
    const root = rootPath || process.cwd();
    const src = path.join(root, "src");
    const output = path.join(root, "dist");
    const assets = path.join(output, "assets");

    this.config = {
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
  }

  initial(opts) {
    const { name, projectPath, eslint, jest, mode } = opts;

    this.task("create directory", createDir(projectPath));
    this.task("create package.json", createPackage(name, projectPath, eslint, jest, mode));
    this.task("initial git", initGit(projectPath));
    this.task("create gitignore", createGitignore(projectPath));
    eslint && this.task("create eslint", createEslint(projectPath));
    this.task("create plume.config.js", createPlumeConfig({ projectPath, ...opts }));
  }

  dependents(opts) {
    const { flow, styledComponents, cssModules, sass, less, jest, eslint } = opts;
    const prod = [];
    const dev = [];

    flow && prod.push("@plume/flow");
    styledComponents && prod.push("styled-components");
    cssModules && prod.push("classnames");
    sass && dev.push("node-sass");
    less && dev.push("less");
    jest && dev.push("jest");

    eslint &&
      dev.push(
        "eslint",
        "babel-eslint",
        "eslint-config-prettier",
        "eslint-plugin-prettier",
        "eslint-plugin-react",
        "precise-commits",
        "prettier",
        "husky",
      );

    return { dev, prod };
  }
  dev(config) {
    this._updateConfig(config);
  }
  build(config) {
    this._updateConfig(config);
  }
  registerCli() {}
  task(...args) {
    return task(...args);
  }
  getConfig(configPath, cwd) {
    return getConfig(configPath, cwd);
  }
  _updateConfig(config) {
    config = config || this.getConfig();
    this.config = deepAssign(this.config, config);
  }
}

module.exports = Core;
