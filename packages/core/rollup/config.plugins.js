const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const json = require("rollup-plugin-json");
const babel = require("rollup-plugin-babel");

module.exports = () => [
  resolve(),
  babel({
    runtimeHelpers: true,
  }),
  commonjs(),
  json(),
];
