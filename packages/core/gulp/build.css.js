const sass = require("gulp-sass");
const less = require("gulp-less");
const { src, dest } = require("gulp");

function _sass(format) {
  return src("src/**/*.scss")
    .pipe(sass())
    .pipe(dest(`lib/${format}`));
}

function _less(format) {
  return src("src/**/*.less")
    .pipe(less())
    .pipe(dest(`lib/${format}`));
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
  return _build("es");
}

module.exports = {
  cjs,
  es,
};
