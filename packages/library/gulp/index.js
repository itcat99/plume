const { parallel } = require("gulp");
const script = require("./task.script");
const css = require("./task.css");
const assets = require("./task.assets");

function esm(cb) {
  script.esm();
  css.esm();
  assets.esm();

  cb();
}

function cjs(cb) {
  script.cjs();
  css.cjs();
  assets.cjs();

  cb();
}

exports.esm = esm;
exports.cjs = cjs;
// exports.assets = assets;
exports.default = parallel(cjs, esm);
