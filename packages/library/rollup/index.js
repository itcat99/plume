const path = require("path");
const plugins = require("./config.plugins");
const rollup = require("rollup");

const getInputCfg = config => {
  const { options, paths } = config;
  const { src } = paths;
  const { externals: external, cssMode } = options;

  const inputCfg = {
    input: path.join(src, "index.js"),
    plugins: plugins(config),
    external: [].concat(external, ["react", "react-dom"]),
  };

  if (cssMode === "styled-components") {
    inputCfg.external.push("styled-components");
  }

  return inputCfg;
};

const getOutputCfg = config => {
  const { paths, lib, options } = config;
  const { output } = paths;
  const { name } = lib;
  const { cssMode } = options;

  const file = path.join(output, "umd", "index.js");
  const outputCfg = {
    file,
    format: "umd",
    name: name || "myLib",
    globals: {
      react: "React",
      "react-dom": "ReactDOM",
    },
  };

  if (cssMode === "styled-components") {
    outputCfg.globals["styled-components"] = "styled";
  }

  return outputCfg;
};

const build = async (inputCfg, outputCfg) => {
  const result = await rollup.rollup(inputCfg);
  result.write(outputCfg);
};

module.exports = async (config, cwd) => {
  cwd && process.chdir(cwd);
  let inputCfg = getInputCfg(config);
  let outputCfg = getOutputCfg(config);
  const { rollup: customRollup } = config.lib;
  if (customRollup) {
    const result = customRollup({ inputCfg, outputCfg }, config);
    inputCfg = result.inputCfg;
    outputCfg = result.outputCfg;
  }

  try {
    await build(inputCfg, outputCfg);
  } catch (error) {
    throw new Error(error);
  }
};
