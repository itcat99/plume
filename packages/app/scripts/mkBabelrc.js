const path = require("path");
const fse = require("fs-extra");
const { isExist } = require("@plume/helper");

const BABELRC = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-for-of",
    "@babel/plugin-syntax-dynamic-import",
  ],
};

module.exports = rootPath => {
  const babelrcPath = path.join(rootPath, ".babelrc");
  if (!isExist(babelrcPath)) {
    fse.writeFileSync(babelrcPath, JSON.stringify(BABELRC, null, 2));
  }
};
