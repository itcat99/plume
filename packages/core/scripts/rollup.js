const rollup = require("rollup");
const { INPUT_ARGS, OUTPUT_ARGS } = require("../rollup/constants");

// const dev = async config => {
//   return rollup.rollup(inputOptions);
// };

const build = async config => {
  const { inputConfig, outputConfig } = config;
  const bundle = await rollup.rollup(inputConfig);
  await bundle.write(outputConfig);
};

module.exports = async (config, isDev) => {
  const rollupConfig = require("../rollup")(config, isDev);
  if (isDev) {
    return;
  } else {
    const result = [];
    rollupConfig.forEach(cfg => {
      const inputConfig = {},
        outputConfig = {};
      const keys = Object.keys(cfg);

      for (const key of keys) {
        const content = cfg[key];

        if (key === "output") {
          for (const _k of Object.keys(content)) {
            outputConfig[_k] = content[_k];
          }
        }

        if (INPUT_ARGS.indexOf(key) >= 0) inputConfig[key] = content;
        if (OUTPUT_ARGS.indexOf(key) >= 0) outputConfig[key] = content;
      }

      result.push(build({ inputConfig, outputConfig }));
    });

    return Promise.all(result);
  }
};
