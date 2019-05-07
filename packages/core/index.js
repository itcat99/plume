const DEFAULT_CONFIG = require("@plume/config");
const webpack = require("./scripts/webpack");
const rollup = require("./scripts/rollup");
const { spawn } = require("child_process");
const path = require("path");

class PlumeCore {
  constructor(config = DEFAULT_CONFIG) {
    this.config = config;
  }

  dev(type, ...args) {
    return this[type](true, ...args);
  }

  build(type, ...args) {
    return this[type](false, ...args);
  }

  webpack(isDev) {
    return new Promise((resolve, reject) => {
      webpack(this.config, isDev)
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }

  docz(isDev, projectPath, outputDir) {
    let doczStdout;

    if (isDev) {
      doczStdout = spawn(`${projectPath}/node_modules/.bin/docz`, ["dev"], {
        cwd: projectPath,
      });
    } else {
      doczStdout = spawn(`${projectPath}/node_modules/.bin/docz`, ["build", "--dest", "doc"], {
        cwd: projectPath,
      });
    }
    doczStdout.stdout.on("data", data => {
      process.stdout.write(data.toString());
    });
    doczStdout.stdout.on("error", err => {
      throw new Error(err);
    });
    doczStdout.on("exit", code => {
      if (code !== 0) throw new Error(code);
    });
  }

  lib(_isDev, inputDir, outputDir, projectPath) {
    const libStdout = spawn(
      `${projectPath}/node_modules/.bin/gulp`,
      ["-f", path.resolve(__dirname, "gulp", "index.js"), "--cwd", projectPath],
      {
        cwd: projectPath,
      },
    );

    libStdout.stdout.on("error", err => {
      throw new Error(err);
    });
    libStdout.on("exit", code => {
      if (code !== 0) throw new Error(code);
    });
  }

  rollup(isDev) {
    return new Promise((resolve, reject) => {
      rollup(this.config, isDev)
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }
}

module.exports = config => new PlumeCore(config);
