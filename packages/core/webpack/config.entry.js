const path = require("path");
const { isFunc } = require("../scripts/helper");

module.exports = config => {
  const { entry } = config.options;
  const { plume } = config.paths;

  if (!entry)
    return {
      main: path.join(plume, "index.jsx"),
    };

  if (isFunc) return entry(config);

  return entry;
};
