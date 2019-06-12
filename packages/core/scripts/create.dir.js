// const path = require("path");
const fse = require("fs-extra");

module.exports = projectPath => {
  // fse.copySync(tempPath, projectPath);
  fse.mkdirSync(projectPath);
};
