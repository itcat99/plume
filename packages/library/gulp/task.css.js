const sass = require("gulp-sass");
const less = require("gulp-less");
const minify = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const { src, dest } = require("gulp");

function _sass(format) {
  return src(`${process.env.PLUME_SRC || "src"}/**/*.scss`)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(dest(`${process.env.PLUME_OUTPUT || "dist"}/${format}`));
}

function _less(format) {
  return src(`${process.env.PLUME_SRC || "src"}/**/*.less`)
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(dest(`${process.env.PLUME_OUTPUT || "dist"}/${format}`));
}

function _css(format) {
  return src(`${process.env.PLUME_SRC || "src"}/**/*.css`)
    .pipe(autoprefixer())
    .pipe(minify())
    .pipe(dest(`${process.env.PLUME_OUTPUT || "dist"}/${format}`));
}

function _build(type) {
  const mode = process.env.PLUME_CSSMODE;
  if (mode === "sass") return _sass(type);
  if (mode === "less") return _less(type);

  return _css(type);
}

module.exports = {
  esm: () => _build("esm"),
  cjs: () => _build("cjs"),
};
