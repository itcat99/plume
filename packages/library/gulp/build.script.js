const babel = require("gulp-babel");
const { src, dest } = require("gulp");
// const babelConfig = require("../scripts/babelConfig");
// const rollup = require("gulp-better-rollup");
// const rollupBabel = require("rollup-plugin-babel");
// const rollupResolve = require("rollup-plugin-node-resolve");
// const rollupCommon = require("rollup-plugin-commonjs");
const terser = require("gulp-terser");

function _build(format) {
  let source = src("src/**/*.+(js|jsx)");

  if (format === "umd") {
    // source = source.pipe(
    //   rollup(
    //     {
    //       plugins: [
    //         rollupResolve(),
    //         rollupBabel({
    //           runtimeHelpers: true,
    //           presets: [
    //             [
    //               "@babel/preset-env",
    //               {
    //                 modules: false,
    //               },
    //             ],
    //           ],
    //           plugins: ["@babel/plugin-transform-runtime"],
    //         }),
    //         rollupCommon(),
    //       ],
    //     },
    //     {
    //       format: "iife",
    //       name: "MyLib",
    //     },
    //   ),
    // );
  } else {
    source
      .pipe(
        babel({
          plugins: [
            [
              "transform-rename-import",
              {
                original: "^(.+?)\\.(sc|sa|le)ss$",
                replacement: "$1.css",
              },
            ],
          ],
        }),
      )
      .pipe(
        terser({
          compress: {
            drop_console: true,
            warnings: false,
            drop_debugger: true,
          },
        }),
      );
  }

  return source.pipe(dest(`lib/${format}`));
}

function cjs(cb) {
  cb();
  return _build("cjs");
}

function es(cb) {
  cb();
  return _build("es");
}

function umd(cb) {
  cb();
  return _build("umd");
}

module.exports = {
  cjs,
  es,
  umd,
};
