// const path = require("path");
const fse = require("fs-extra");
const { isExist } = require("@plume/helper");

module.exports = projectPath => {
  // fse.copySync(tempPath, projectPath);
  if (isExist(projectPath)) return false;
  fse.mkdirSync(projectPath);
};
