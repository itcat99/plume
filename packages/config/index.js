const path = require("path");

const root = process.cwd();
const src = path.join(root, "src");
const pages = path.join(src, "pages");
const output = path.join(root, "dist");
const plume = path.join(root, ".plume");
const assets = path.join(output, "assets");
const components = path.join(src, "components");
const containers = path.join(src, "containers");
const modules = path.join(src, "modules");

module.exports = {
  mode: "app",
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
  options: {
    entry: null,
    assetsExt: ["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"],
    analyzer: false,
    flow: false,
    gzip: true,
    port: 8080,
    externals: null,
    progress: true,
  },
  app: {
    target: "root",
    webpack: null,
    dll: true,
    dllName: "vendor",
    dllVendor: ["react", "react-dom", "react-router-dom", "react-loadable"],
    hashRouter: false,
  },
  lib: {
    rollup: null,
  },
};
