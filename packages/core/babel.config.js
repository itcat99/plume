module.exports = {
  presets: ["@babel/preset-env", "@preset-react"],
  plugins: [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-for-of",
    "@babel/plugin-syntax-dynamic-import",
  ],
};
