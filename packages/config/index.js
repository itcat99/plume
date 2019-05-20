const path = require("path");
const appCfg = require("./app");
const libCfg = require("./lib");

const root = process.cwd();
const src = path.join(root, "src");
const pages = path.join(src, "pages");
const output = path.join(root, "dist");
const plume = path.join(root, ".plume");
const assets = path.join(output, "assets");
const components = path.join(src, "components");
const containers = path.join(src, "containers");
const modules = path.join(src, "modules");

module.exports = (mode = "app") => {
  const modeCfg = mode === "app" ? appCfg : libCfg;

  const options = Object.assign(
    {},
    {
      entry: null,
      assetsExt: ["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"],
      analyzer: false,
      port: 8080,
      externals: [],
      cssMode: "css",
      cssModules: false,
    },
    modeCfg,
  );

  return {
    mode: mode,
    paths: {
      assets,
      components,
      containers,
      modules,
      output,
      pages,
      plume,
      root,
      src,
    },
    options,
  };
};
