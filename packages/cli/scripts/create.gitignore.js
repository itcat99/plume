const path = require("path");
const fse = require("fs-extra");

module.exports = projectPath => {
  fse.copyFileSync(
    path.resolve(__dirname, "..", "templates", "gitignore"),
    path.join(projectPath, ".gitignore"),
  );
};
