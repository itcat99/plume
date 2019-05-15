const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const json = require("rollup-plugin-json");
const babel = require("rollup-plugin-babel");
const css = require("rollup-plugin-postcss");
const path = require("path");

const getPlugins = () => {
  return Object.assign({}, require("../scripts/babel")("umd"), {
    exclude: "node_modules/**",
    runtimeHelpers: true,
  });
};

module.exports = config => {
  const { options, paths } = config;
  const { root } = paths;
  const { cssModules } = options;

  /* fixed [name] is not exported by [module] bug https://rollupjs.org/guide/en#error-name-is-not-exported-by-module- */
  const reactDir = path.join(root, "/node_modules/react/index.js");
  const namedExports = {
    [reactDir]: [
      "Component",
      "PureComponent",
      "memo",
      "createElement",
      "createFactory",
      "CloneElement",
      "isValidElement",
      "Fragment",
      "createRef",
      "forwardRef",
      "lazy",
      "Suspense",
    ],
  };

  return [
    resolve({
      extensions: [".jsx", ".js", ".mjs", ".json"],
    }),
    babel(getPlugins()),
    commonjs({
      namedExports,
    }),
    css({
      extensions: [".scss", ".sass", ".less", ".css"],
      modules: cssModules,
      extract: true,
    }),
    json(),
  ];
};
