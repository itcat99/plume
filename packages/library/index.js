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
    const { root } = this.config.paths;
    this.run(this.docz, ["dev"], { cwd: root });
  }

  build() {
    const { paths } = this.config;
    const { root, output, src } = paths;

    process.env.PLUME_OUTPUT = output;
    process.env.PLUME_SRC = src;

    const gulpConfig = path.resolve(__dirname, "gulp", "index.js");

    this.run(this.gulp, ["-f", gulpConfig, "--cwd", root])
      .then(() => rollup(this.config, root))
      .then(() => this.run(this.docz, ["build"], { cwd: root }))
      .catch(err => console.error(err));
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

      // result.stdout.on("error", err => {
      //   reject(err);
      // });

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
