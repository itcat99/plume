const sass = require("gulp-sass");
const less = require("gulp-less");
const { src, dest } = require("gulp");

function _sass(format) {
  return src(`${process.env.PLUME_SRC || "src"}/**/*.scss`)
    .pipe(sass())
    .pipe(dest(`${process.env.PLUME_OUTPUT || "dist"}/${format}`));
}

function _less(format) {
  return src(`${process.env.PLUME_SRC || "src"}/**/*.less`)
    .pipe(less())
    .pipe(dest(`${process.env.PLUME_OUTPUT || "dist"}/${format}`));
}

function _build(format) {
  _sass(format);
  _less(format);
}

function cjs(cb) {
  cb();
  return _build("cjs");
}

function es(cb) {
  cb();
  return _build("esm");
}

module.exports = {
  cjs,
  es,
};
