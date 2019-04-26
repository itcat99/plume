const path = require("path");
const fse = require("fs-extra");
const { isExist } = require("./helper");

const BABELRC = {
  presets: [[
    "@babel/preset-env",
    {
      "modules": false
    }
  ], , "@babel/preset-react"],
  plugins: [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-for-of"
  ],
}

module.exports = rootPath => {
  const babelrcPath = path.join(rootPath, ".babelrc");
  if (!isExist(babelrcPath)) {
    fse.writeFileSync(babelrcPath, JSON.stringify(BABELRC, null, 2));
  }
};
