module.exports = () => {
  return {
    paths: {},
    options: {
      name: "PlumeLib",
      webpack: null,
      modules: ["esm", "cjs", "umd"],
      docDist: "doc",
      externals: [],
    },
  };
};
