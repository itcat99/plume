const fse = require("fs-extra");
const path = require("path");

module.exports = opts => {
  const { mode, flow, projectPath, cssMode, cssModules } = opts;
  const config = {
    mode,
    options: {
      cssMode,
      cssModules,
    },
  };

  if (mode === "app") {
    config.app = {
      flow,
    };
  }

  fse.writeFileSync(
    path.join(projectPath, "plume.config.js"),
    `module.exports = ${JSON.stringify(config, null, 2)};`,
  );
};
