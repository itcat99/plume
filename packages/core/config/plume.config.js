const path = require("path");

const root = process.cwd();
const src = path.join(root, "src");
const pages = path.join(src, "pages");
const output = path.join(root, "dist");
const plume = path.join(root, ".plume");

module.exports = {
  paths: {
    root,
    src,
    pages,
    output,
    plume,
  },
  options: {
    target: "root",
    analyzer: false,
    flow: false,
    gzip: true,
    dll: true,
    port: 8080,
    dllName: "vendor",
    dllVendor: ["react", "react-dom", "react-router-dom", "react-loadable"],
  },
};
