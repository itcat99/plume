const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const json = require("rollup-plugin-json");
const babel = require("rollup-plugin-babel");
const css = require("rollup-plugin-postcss");
const url = require("postcss-url");
const cpy = require("rollup-plugin-cpy");
const autoprefixer = require("autoprefixer");
const scss = require("rollup-plugin-scss");
const { terser } = require("rollup-plugin-terser");
const path = require("path");
const { isExist } = require("@plume/helper");

const getPlugins = () => {
  return Object.assign({}, require("../scripts/babel")("umd"), {
    exclude: "node_modules/**",
    runtimeHelpers: true,
  });
};

module.exports = config => {
  const { options, paths } = config;
  const { root, src, output } = paths;
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
    terser(),
    cpy({
      files: `${src}/**/*.+(${process.env.PLUME_ASSETSEXT.replace(/,/g, "|")})`,
      dest: `${output}/umd/assets`,
    }),
    scss({
      // output: path.join(output, "umd", "style.css"),
      output: true,
    }),
    // css({
    //   extensions: [".scss", ".sass", ".less", ".css"],
    //   modules: cssModules,
    //   // minimize: true,
    //   extract: true,
    //   plugins: [
    //     // autoprefixer(),
    //     url({
    //       filter: "**/*.jpg",
    //       url: asset => isExist(asset.absolutePath) && `./assets/${asset.url}`,
    //     }),
    //   ],
    // }),
    json(),
  ];
};
