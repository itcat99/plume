module.exports = modules => {
  const plugins = [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-for-of",
  ];

  if (modules !== "umd") {
    plugins.push([
      "transform-rename-import",
      {
        original: "^(.+?)\\.(sc|sa|le)ss$",
        replacement: "$1.css",
      },
    ]);
  }

  return {
    presets: [
      ["@babel/preset-env", { modules: modules === "cjs" ? "cjs" : false }],
      "@babel/preset-react",
    ],
    plugins,
  };
};
