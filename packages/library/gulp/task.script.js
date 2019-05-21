const babel = require("gulp-babel");
const { src, dest } = require("gulp");
const terser = require("gulp-terser");

function _build(format) {
  return (
    src(`${process.env.PLUME_SRC || "src"}/**/*.+(js|jsx)`)
      .pipe(babel(require("../scripts/babel")(format)))
      // .on("error", err => console.error("error: ", err))
      .pipe(
        terser({
          compress: {
            drop_console: true,
            warnings: false,
            drop_debugger: true,
          },
        }),
      )
      .pipe(dest(`${process.env.PLUME_OUTPUT || "dist"}/${format}`))
  );
}

module.exports = {
  esm: () => _build("esm"),
  cjs: () => _build("cjs"),
};
