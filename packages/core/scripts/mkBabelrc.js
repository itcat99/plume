const path = require("path");
const fse = require("fs-extra");
const { isExist } = require("./helper.js");

module.exports = rootPath => {
  const babelrcPath = path.join(rootPath, ".babelrc");
  if (!isExist(babelrcPath)) {
    fse.copyFileSync(path.resolve(__dirname, "../config", ".babelrc"), babelrcPath);
  }
};
