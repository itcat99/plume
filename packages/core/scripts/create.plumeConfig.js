const fse = require("fs-extra");
const path = require("path");

module.exports = opts => {
  const { mode, flow, projectPath, cssMode, cssModules, styledComponents } = opts;
  const config = {
    mode,
    options: {
      cssMode,
      cssModules,
      styledComponents,
      flow,
    },
  };

  fse.writeFileSync(
    path.join(projectPath, "plume.config.js"),
    `module.exports = ${JSON.stringify(config, null, 2)};`,
  );
};
