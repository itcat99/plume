const path = require("path");
const fse = require("fs-extra");

module.exports = rootPath => {
  fse.copyFileSync(
    path.resolve(__dirname, "..", "config", "babel.js"),
    path.join(rootPath, "babel.config.js"),
  );
};
