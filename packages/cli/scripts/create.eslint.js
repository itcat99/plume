/* eslint no-console:0 */
const { path } = require("@plume/helper");
const fse = require("fs-extra");

module.exports = projectPath => {
  const tempPath = path.resolve(__dirname, "..", "templates", "eslint");
  fse
    .readdir(tempPath)
    .then(files => {
      files.forEach(file => {
        fse.copyFileSync(path.join(tempPath, file), path.join(projectPath, file));
      });
    })
    .catch(err => console.error("Create eslint error: ", err));
};
