const path = require("path");
const fse = require("fs-extra");
const { isExist } = require("@plume/helper");

const BABELRC = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "55",
          ie: "11",
        },
      },
    ],
    "@babel/preset-react",
  ],
  plugins: ["@babel/proposal-class-properties", "@babel/plugin-syntax-dynamic-import"],
};

module.exports = rootPath => {
  const babelrcPath = path.join(rootPath, ".babelrc");
  if (!isExist(babelrcPath)) {
    fse.writeFileSync(babelrcPath, JSON.stringify(BABELRC, null, 2));
  }
};
