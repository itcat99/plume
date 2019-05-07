const type = process.env.BABEL_ENV;
// const targetDir = type === "esm" ? "esm" : "lib";

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: type === "esm" ? false : "cjs",
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-for-of",
    "@babel/plugin-syntax-dynamic-import",
    // ["css-modules-transform", {
    //   extensions: [".scss", '.less', '.css'],
    //   extractCss: {
    //     "dir": `./${targetDir}/`,
    //     "relativeRoot": "./src/",
    //     "filename": "[path]/style/[name].css"
    //   },
    //   "preprocessCss": "./scripts/processSass.js"
    // }]
  ],
};
