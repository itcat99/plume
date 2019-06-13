const getMode = require("../scripts/getMode");

module.exports = (config, instance) => {
  if (!instance) {
    const { mode } = config;
    const Mode = getMode(mode);
    instance = new Mode();
  }

  instance.build(config);
};
