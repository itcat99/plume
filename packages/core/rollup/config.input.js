const path = require("path");
const fs = require("fs");

const getInput = src => {
  const result = {};

  fs.readdirSync(src).forEach(child => {
    if (child === "index.js") {
      result["index"] = path.join(src, child);
    } else {
      result[child] = path.join(src, child, "index.js");
    }
  });

  return result;
};

module.exports = (src, umd) => {
  if (umd) {
    return path.join(src, "index.js");
  }

  return getInput(src);
};
