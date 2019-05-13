/* eslint no-console:0 */
const path = require("path");
const fse = require("fs-extra");
const { isExist, task } = require("@plume/helper");
const mkBabelrc = require("./scripts/mkBabelrc");
const { spawnSync } = require("child_process");

/**
 * 初始化lib
 * @param {string} config plume配置
 */
class Lib {
  constructor(config) {
    this.config = config;

    this.init();
  }

  init() {
    const { paths } = this.config;
    const { plume, root } = paths;

    if (isExist(plume)) {
      fse.removeSync(plume);
    }

    /* 创建.plume目录 */
    task("create .plume directory", fse.mkdirSync(plume));
    /* 创建.babelrc文件 */
    task("create babel file", mkBabelrc(root));
  }

  dev() {
    const { root } = this.config.paths;

    // core(this.config).dev("docz", root);
  }

  build() {
    const { lib, paths } = this.config;
    const { src, output, root } = paths;
    const { modules } = lib;

    console.log("build lib");
    const gulp = path.join(__dirname, "node_modules", ".bin", "gulp");
    const gulpConfig = path.resolve(__dirname, "gulp", "index.js");
    modules.forEach(m => {
      process.env.BABEL_ENV = m;
      const result = spawnSync(gulp, ["-f", gulpConfig, "--cwd", root]);
      if (result.error) throw new Error(result.error);
      // task("build esm", core(this.config).build("lib", src, path.join(output, "esm"), root));
    });
    // esm
    process.env.BABEL_ENV = "esm";

    // cjs
    process.env.BABEL_ENV = "cjs";
    // task("build cjs", core(this.config).build("lib", src, path.join(output, "lib"), root));
  }

  buildDocz() {
    const { root } = this.config.paths;
    // task("build document", core(this.config).build("docz", root, path.join(root, "doc")));
  }
}

module.exports = Lib;
