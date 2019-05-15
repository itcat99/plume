/* eslint no-console:0 */
const path = require("path");
const fse = require("fs-extra");
const { isExist, whichBin } = require("@plume/helper");
const { spawn } = require("child_process");
const rollup = require("./rollup");

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
    this.run(this.docz, ["dev", "-p", port], { cwd: root });
  }

  build() {
    const { paths, lib, options } = this.config;
    const { root, output, src } = paths;
    const { modules, docDist } = lib;
    const { cssMode, assetsExt } = options;

    process.env.PLUME_OUTPUT = output;
    process.env.PLUME_SRC = src;
    process.env.PLUME_CSSMODE = cssMode;
    process.env.PLUME_ASSETSEXT = assetsExt.toString();

    const gulpConfig = path.resolve(__dirname, "gulp", "index.js");

    modules.forEach(type => {
      if (type === "umd") {
        rollup(this.config, root).catch(err => console.error(err));
      } else {
        this.run(this.gulp, [type, "-f", gulpConfig, "--cwd", root]).catch(err =>
          console.error(err),
        );
      }
    });

    // this.run(this.gulp, ["assets", "-f", gulpConfig, "--cwd", root]);
    this.run(this.docz, ["build", "-d", docDist], { cwd: root }).catch(err => console.error(err));
  }

  /**
   * 运行cli命令 spawn
   * @param {string} command cli命令或命令路径
   * @param {array} args cli命令附加参数
   * @param {object} opts 配置项
   */
  run(command, args, opts) {
    return new Promise((resolve, reject) => {
      const result = spawn(command, args, opts);
      result.stdout.on("data", data => {
        process.stdout.write(`${data.toString()}\r`);
      });

      result.stderr.on("data", data => {
        console.error("err: ", data.toString());
      });

      result.on("exit", code => {
        if (code !== 0) reject();
        resolve();
      });
    });
  }
}

module.exports = Lib;
