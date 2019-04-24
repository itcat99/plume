const DEFAULT_CONFIG = require("@plume/config");
const webpack = require("./scripts/webpack");

class PlumeCore {
  constructor(config = DEFAULT_CONFIG) {
    this.config = config;
  }

  dev() {
    return this.run(true);
  }

  build() {
    return this.run(false);
  }

  run(isDev) {
    return new Promise((resolve, reject) => {
      webpack(this.config, isDev)
        .then(result => resolve(result))
        .catch(err => reject(err));
    });
  }
}

module.exports = config => new PlumeCore(config);
