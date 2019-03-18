const path = require("path");

const root = process.cwd();
const src = path.join(root, "src");
const pages = path.join(src, "pages");
const output = path.join(root, "dist");
const plume = path.join(root, ".plume");
const assets = path.join(output, "assets");
const components = path.join(src, "components");
const containers = path.join(src, "containers");

module.exports = {
  paths: {
    assets,
    components,
    containers,
    output,
    pages,
    plume,
    root,
    src,
  },
  options: {
    assetsExt: ["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"],
    target: "root",
    analyzer: false,
    flow: false,
    gzip: true,
    dll: true,
    port: 8080,
    dllName: "vendor",
    dllVendor: ["react", "react-dom", "react-router-dom", "react-loadable"],
  },
  webpack: null,
};
