const path = require("path");
const plugins = require("./config.plugins");
const rollup = require("rollup");

const getInputCfg = config => {
  const { options, paths } = config;
  const { src } = paths;
  const { externals: external } = options;

  const inputCfg = {
    input: path.join(src, "index.js"),
    plugins: plugins(config),
    external,
  };

  return inputCfg;
};

const getOutputCfg = config => {
  const { paths, lib } = config;
  const { output } = paths;
  const { name } = lib;

  const file = path.join(output, "umd", "index.js");
  return {
    file,
    format: "umd",
    name,
  };
};

const build = async (inputCfg, outputCfg) => {
  const result = await rollup.rollup(inputCfg);
  result.write(outputCfg);
};

module.exports = async (config, cwd) => {
  cwd && process.chdir(cwd);
  const inputCfg = getInputCfg(config);
  const outputCfg = getOutputCfg(config);

  try {
    await build(inputCfg, outputCfg);
  } catch (error) {
    throw new Error(error);
  }
};
