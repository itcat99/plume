const path = require("path");

const root = process.cwd();
const src = path.join(root, "src");
const pages = path.join(src, "pages");
const output = path.join(root, "dist");

module.exports = {
  paths: {
    root,
    src,
    pages,
    output,
  },
  options: {
    model: false,
    gzip: true,
    dll: true,
    dllName: "vendor",
    dllVendor: ["react", "react-dom", "react-router-dom", "react-redux", "redux"],
  },
};
