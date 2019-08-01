const path = require("path");
const fse = require("fs-extra");
const gulp = require("gulp");
const ts = require("gulp-typescript");
const cache = require("gulp-cached");

const { series, watch, dest } = gulp;
const deskDir = path.resolve(__dirname, "lib");
const srcDir = path.resolve(__dirname, "src");
const tsProject = ts.createProject("tsconfig.json");

/* clean dir */
const clean = cb => {
  fse.emptyDirSync(deskDir);

  return cb();
};

/* transform */
const build = cb => {
  gulp
    .src(path.join(srcDir, "*"))
    .pipe(cache("transform"))
    .pipe(tsProject())
    .pipe(dest(deskDir));

  return cb();
};

/* watch */
const watching = cb => {
  watch(path.join(srcDir, "*"), build);
  return cb();
};

exports.build = build;
exports.dev = series(clean, build, watching);
exports.build = series(clean, build);
