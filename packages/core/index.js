const DEFAULT_CONFIG = require("./config/plume.config");
const { deepAssign } = require("./scripts/helper");
const webpack = require("./scripts/webpack");

function getCfg(config) {
  let _cfg = DEFAULT_CONFIG;
  const mode = config.mode || process.env.PLUME_ENV || _cfg.mode;

  if (mode === "lib") {
    const { options } = _cfg;
    options.gzip = false;
    options.dll = false;
  }

  return deepAssign(_cfg, config);
}

class PlumeCore {
  constructor(config) {
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

module.exports = config => {
  const _config = getCfg(config);
  const { mode } = _config;
  if (!process.env.PLUME_ENV) process.env.PLUME_ENV = mode;

  return new PlumeCore(_config);
};
