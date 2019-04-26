/* eslint no-console:0 */
const path = require("path");
const fse = require("fs-extra");
const {
  getConfig,
  isExist,
  debounce
} = require("./scripts/helper");
const mkBabelrc = require("./scripts/mkBabelrc");
const core = require("@plume/core");
const chokidar = require("chokidar");
const chalk = require("chalk");

/**
 * 初始化lib
 * @param {string} customConfig 手动指定的配置文件路径
 */
class Lib {
  constructor(customConfig) {
    this.customConfig = customConfig;
    
    this.init();
  }

  init() {
    const config = getConfig(this.customConfig);
    const {
      paths
    } = config;
    const {
      plume,
      root
    } = paths;

    this.config = config;

    /* 创建.plume目录 */
    if (isExist(plume)) {
      fse.removeSync(plume);
    }
    fse.mkdirSync(plume);

    /* 创建配置文件 */
    fse.writeFileSync(
      path.join(plume, "config.js"),
      `module.exports = ${JSON.stringify(config, null, 2)}`,
    );
    /* 创建.babelrc文件 */
    mkBabelrc(root);
  }

  dev() {
    const {
      pages,
      root,
      plume
    } = this.config.paths;
    const {
      flow
    } = this.config.options;

    core(this.config)
      .dev("rollup")
      .then(() => { })
      .catch(err => console.error("dev err: ", err));
  }

  build() {
    core(this.config)
      .build("rollup")
      .then(() => {
        console.log("is build!")
      })
      .catch(err => console.log(chalk.red(`[ROLLUP BUILD ERROR] ==> ${err}`)));
  }
}

module.exports = Lib;