const path = require("path");
const fse = require("fs-extra");
const babel = require("@babel/core");
const { isExist } = require("../scripts/helper");

const data = fse.readFileSync(path.resolve(__dirname, "..", "index.js"));

babel.transform(
  data,
  {
    presets: ["@babel/preset-env"],
    compact: true,
    minified: true,
  },
  (err, result) => {
    if (err) throw new Error(err);

    const outputDir = path.resolve(__dirname, "..", "lib");
    if (!isExist(outputDir)) fse.mkdirSync(outputDir);
    fse.createFileSync(path.join(outputDir, "index.js"));
    fse.writeFileSync(path.join(outputDir, "index.js"), result.code);
  },
);
