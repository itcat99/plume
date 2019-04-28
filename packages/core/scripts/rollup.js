const rollup = require("rollup");
const getCfg = require("../rollup");

const build = async (inputCfg, outputCfg) => {
  const result = await rollup.rollup(inputCfg);
  result.write(outputCfg);
};

module.exports = (config, isDev) => {
  const { lib } = config;
  const { rollup: customRollup } = lib;

  let rollupConfig = getCfg(config, isDev);
  if (customRollup) {
    rollupConfig = customRollup(rollupConfig, config, isDev);
  }

  let result = [];
  rollupConfig.forEach(cfg => {
    const { input, output } = cfg;
    result.push(build(input, output));
  });

  return Promise.all(result);
};
