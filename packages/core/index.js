const DEFAULT_CONFIG = require("@plume/config");
const webpack = require("./scripts/webpack");
const rollup = require("./scripts/rollup");

class PlumeCore {
  constructor(config = DEFAULT_CONFIG) {
    this.config = config;
  }

  dev(type) {
    return this[type](true);
  }

  build(type) {
    return this[type](false);
  }

  webpack(isDev) {
    return new Promise((resolve, reject) => {
      webpack(this.config, isDev)
        .then(result => resolve(result))
        .catch(err => reject(err));
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
