const { path } = require("@plume/helper");
const appCfg = require("./app");
const libCfg = require("./lib");
const { deepAssign } = require("@plume/helper");

const root = process.cwd();
const src = path.join(root, "src");
const output = path.join(root, "dist");
const assets = path.join(output, "assets");

const commonCfg = {
  paths: {
    root,
    src,
    output,
    assets,
  },
  options: {
    entry: null,
    assetsExt: ["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"],
    port: 8080,
    cssMode: "css",
    cssModules: false,
  },
};

module.exports = (mode = "app") => {
  const modeCfg = mode === "app" ? appCfg : libCfg;
  const { paths, options } = modeCfg(commonCfg);

  return deepAssign(commonCfg, { mode, paths, options });
};
