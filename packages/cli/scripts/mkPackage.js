const path = require("path");
const fse = require("fs-extra");

module.exports = (name, projectPath, eslint, jest, mode) => {
  const data = {
    name,
    version: "0.0.1",
    main: "index.js",
    license: "MIT",
    scripts: {
      initial: "plume-cli init",
      dev: "plume-cli dev",
      build: "plume-cli build",
    },
  };

  if (eslint) {
    data["husky"] = {
      hooks: {
        "pre-commit": "precise-commits",
      },
    };
  }

  if (jest) data.scripts["test"] = "jest";
  if (mode === "lib") {
    data.scripts["build:doc"] = "docz build";
    data.scripts["dev:doc"] = "docz dev";
  }

  fse.writeFileSync(path.join(projectPath, `package.json`), JSON.stringify(data, null, 2));
};
