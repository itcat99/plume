const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const json = require("rollup-plugin-json");

module.exports = config => {
  // const { paths } = config;
  // const { src } = paths;

  return [
    resolve(),
    babel({
      runtimeHelpers: true,
    }),
    commonjs(),
    json(),
  ];
};
