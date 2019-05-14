const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const json = require("rollup-plugin-json");
const babel = require("rollup-plugin-babel");
const css = require("rollup-plugin-postcss");

const getPlugins = () => {
  return Object.assign({}, require("../scripts/babel")("umd"), {
    exclude: "node_modules/**",
    runtimeHelpers: true,
  });
};

module.exports = config => {
  const { options } = config;
  const { cssModules } = options;

  return [
    resolve({
      extensions: [".jsx", ".js", ".mjs", ".json"],
    }),
    babel(getPlugins()),
    commonjs(),
    css({
      extensions: [".scss", ".sass", ".less", ".css"],
      modules: cssModules,
      extract: true,
    }),
    json(),
  ];
};
