/* eslint no-console:0 */
const path = require("path");
const fse = require("fs-extra");
const { isExist, task } = require("@plume/helper");
const mkBabelrc = require("./scripts/mkBabelrc");
const core = require("@plume/core");
// const chokidar = require("chokidar");
// const chalk = require("chalk");

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
    // const config = getConfig(this.customConfig);
    const { paths } = this.config;
    const { plume, root } = paths;

    // this.config = config;

    /* 创建.plume目录 */
    if (isExist(plume)) {
      fse.removeSync(plume);
    }
    fse.mkdirSync(plume);

    /* 创建配置文件 */
    fse.writeFileSync(
      path.join(plume, "config.js"),
      `module.exports = ${JSON.stringify(this.config, null, 2)}`,
    );
    /* 创建.babelrc文件 */
    mkBabelrc(root);
  }

  dev() {
    const { root } = this.config.paths;

    core(this.config).dev("docz", root);
  }

  build() {
    const { src, output, root } = this.config.paths;

    // esm
    process.env.BABEL_ENV = "esm";
    task("build esm", core(this.config).build("lib", src, path.join(output, "esm"), root));
    // cjs
    process.env.BABEL_ENV = "cjs";
    task("build cjs", core(this.config).build("lib", src, path.join(output, "lib"), root));
  }

  buildDocz() {
    const { root } = this.config.paths;
    task("build document", core(this.config).build("docz", root, path.join(root, "doc")));
  }
}

module.exports = Lib;
