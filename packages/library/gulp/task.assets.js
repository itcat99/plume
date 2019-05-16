const { src, dest } = require("gulp");
const assetsExt = process.env.PLUME_ASSETSEXT;
const _src = process.env.PLUME_SRC;
const output = process.env.PLUME_OUTPUT;

const copy = type =>
  src(`${_src}/**/*.+(${assetsExt.replace(/,/g, "|")})`).pipe(dest(`${output}/${type}`));

module.exports = {
  esm: () => copy("esm"),
  cjs: () => copy("cjs"),
};
