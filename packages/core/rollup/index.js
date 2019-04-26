const dev = require("./config.dev");
const build = require("./config.build");

module.exports = (config, isDev) => {
  return isDev ? dev(config) : build(config);
};
