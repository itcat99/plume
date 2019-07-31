/* eslint no-console:0 */
const { path } = require("@plume/helper");
const fse = require("fs-extra");
const { isExist, whichBin, spawn } = require("@plume/helper");
const webpack = require("./webpack");

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

    this.gulp = whichBin("gulp", root);
    this.docz = whichBin("docz", root);

    if (isExist(plume)) {
      fse.removeSync(plume);
    }
  }

  dev() {
    const { paths, options } = this.config;
    const { root } = paths;
    const { port } = options;

    spawn(this.docz, ["dev", "-p", port, "--color"], { cwd: root });
  }

  build() {
    const { paths, options } = this.config;
    const { root, output, src } = paths;
    const { cssMode, assetsExt, modules, docDist } = options;

    process.env.PLUME_OUTPUT = output;
    process.env.PLUME_SRC = src;
    process.env.PLUME_CSSMODE = cssMode;
    process.env.PLUME_ASSETSEXT = assetsExt.toString();

    const gulpConfig = path.resolve(__dirname, "gulp", "index.js");

    modules.forEach(type => {
      if (type === "umd") {
        webpack(this.config);
      } else {
        spawn(this.gulp, [type, "-f", gulpConfig, "--cwd", root]).catch(err => console.error(err));
      }
    });

    spawn(this.docz, ["build", "-d", docDist], { cwd: root }).catch(err => console.error(err));
  }
}

module.exports = Lib;
