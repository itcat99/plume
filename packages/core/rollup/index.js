const path = require("path");
const input = require("./config.input");
const output = require("./config.output");
const plugins = require("./config.plugins");
const { TYPE_LIST } = require("./constants");

const getInputCfg = (src, type, external) => {
  const inputCfg = {
    input: input(src, type === "umd" ? true : false),
    plugins: plugins(),
    external,
  };

  return inputCfg;
};

const getOutputCfg = (dist, type, name) => {
  return output(
    type === "umd" ? path.join(dist, type, "index.js") : path.join(dist, type),
    type,
    name,
  );
};

module.exports = (config, isDev) => {
  // return isDev ? dev(config) : build(config);
  const { paths, options, lib } = config;
  const { src, output } = paths;
  const { externals } = options;
  const { name } = lib;
  const result = [];

  TYPE_LIST.forEach(type => {
    const cfg = {
      input: getInputCfg(src, type, externals),
      output: getOutputCfg(output, type, name),
    };

    result.push(cfg);
  });

  return result;
};
