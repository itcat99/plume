const rollup = require("rollup");

const dev = config => {
  return rollup.rollup(inputOptions);
};

module.exports = async (config, isDev) => {
  const { paths, options, lib } = config;
  const { src, components } = paths;
  const { rollup: customRollup } = lib;

  const rollupConfig = require("../rollup")(config, isDev);
  rollup(rollup);
};
