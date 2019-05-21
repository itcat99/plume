const sass = require("gulp-sass");
const less = require("gulp-less");
const minify = require("gulp-clean-css");
// const autoprefixer = require("gulp-autoprefixer");
const autoprefixer = require("autoprefixer");
const { src, dest } = require("gulp");
const postcss = require("gulp-postcss");
const cssModules = require("postcss-modules");

const plugins = [autoprefixer(), cssModules()];

function _sass(format) {
  return src(`${process.env.PLUME_SRC || "src"}/**/*.scss`)
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(minify())
    .pipe(dest(`${process.env.PLUME_OUTPUT || "dist"}/${format}`));
}

function _less(format) {
  return src(`${process.env.PLUME_SRC || "src"}/**/*.less`)
    .pipe(less())
    .pipe(postcss(plugins))
    .pipe(minify())
    .pipe(dest(`${process.env.PLUME_OUTPUT || "dist"}/${format}`));
}

function _css(format) {
  return src(`${process.env.PLUME_SRC || "src"}/**/*.css`)
    .pipe(postcss(plugins))
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
