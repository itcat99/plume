const type = process.env.BABEL_ENV;
const modules = type === "esm" ? false : type === "cjs" ? "cjs" : "umd";

module.exports = {
  presets: [["@babel/preset-env", { modules }], "@babel/preset-react"],
  plugins: [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-for-of",
  ],
};
