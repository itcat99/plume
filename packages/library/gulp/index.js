const { parallel } = require("gulp");
const script = require("./build.script");
const css = require("./build.css");

function cjs() {
  return parallel(script.cjs, css.cjs);
}

function es() {
  return parallel(script.es, css.es);
}

exports.css = parallel(css.cjs, css.es);
exports.js = parallel(script.cjs, script.es);
exports.default = parallel(cjs(), es());
