const { path } = require("@plume/helper");
const fse = require("fs-extra");

module.exports = (projectPath, mode, flow) => {
  const tempName = flow ? `${mode}-flow` : mode;
  const tempPath = path.resolve(__dirname, "..", "templates", tempName);

  fse.copySync(tempPath, projectPath);
};
