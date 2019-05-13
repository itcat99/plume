const fse = require("fs-extra");
const path = require("path");

module.exports = opts => {
  const { mode, flow, projectPath } = opts;
  const config = { mode };

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
