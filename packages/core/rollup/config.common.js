const path = require("path");
const fse = require("fs-extra");
const { isExist, isDir, isFunc } = require("../scripts/helper");
const { TYPE_LIST } = require("./constants");

const generateItemCfg = opts => {
  const { input, output, plugins, name, libName } = opts;
  return TYPE_LIST.map(type => {
    const opt = {
      input: input,
      output: {
        // file: path.join(output, type, name, "index.js"),
        format: type,
      },
      plugins,
      external: ["react"],
    };

    if (libName) {
      opt.output.file = path.join(output, type, "index.js");
      opt.output.name = libName;
    } else {
      opt.output.file = path.join(output, type, name, "index.js");
      opt.output.name = name;
    }
    return opt;
  });
};

module.exports = config => {
  const { paths, lib } = config;
  const { components, output, src } = paths;
  const { rollup: customRollup, name = "MyLib" } = lib;
  const plugins = require("./config.plugins")(config);
  let rollupCfg = [];

  if (isExist(components)) {
    const result = fse.readdirSync(components);
    result.forEach(item => {
      const cmpPath = path.join(components, item);
      if (isDir(cmpPath)) {
        rollupCfg = [].concat(
          rollupCfg,
          generateItemCfg({ input: cmpPath, output, plugins, name: item }),
        );
      }
    });
  }

  const entryFile = path.join(src, "index.js");
  if (isExist(entryFile))
    rollupCfg = [].concat(
      rollupCfg,
      generateItemCfg({ input: entryFile, output, plugins, libName: name }),
    );

  if (customRollup && isFunc(customRollup)) rollupCfg = customRollup(rollupCfg, config);

  return rollupCfg;
};
