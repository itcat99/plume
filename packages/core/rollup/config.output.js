module.exports = (src, type, name) => {
  if (type === "umd") {
    return {
      file: src,
      format: type,
      name,
    };
  }

  return {
    dir: src,
    entryFileNames: "[name]/index.js",
    format: type,
  };
};
