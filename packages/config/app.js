const path = require("path");

module.exports = commonCfg => {
  const { paths } = commonCfg;
  const { src, root } = paths;

  const plume = path.join(root, ".plume");
  const components = path.join(src, "components");
  const containers = path.join(src, "containers");
  const modules = path.join(src, "modules");
  const pages = path.join(src, "pages");

  return {
    paths: {
      plume,
      components,
      containers,
      modules,
      pages,
    },
    options: {
      target: "root",
      flow: false,
      webpack: null,
      dll: true,
      dllName: "vendor",
      dllVendor: ["react", "react-dom", "react-router-dom", "react-loadable"],
      hashRouter: false,
      gzip: true,
      proxy: null,
      analyzer: false,
      externals: [],
    },
  };
};
