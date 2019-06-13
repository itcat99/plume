/* eslint no-console:0 */
const { task, getConfig, deepAssign } = require("@plume/helper");
const skipDependents = require("../scripts/skip");
const yarnInstall = require("../scripts/yarnInstall");

module.exports = opts => {
  const { mode, skip, projectPath } = opts;
  const modeClass = require("../scripts/getMode")(mode);
  const instance = new modeClass(projectPath);

  instance.initial(opts);
  const { dev, prod } = instance.dependents(opts);
  if (skip) {
    task("build project");
    skipDependents(prod, dev, projectPath);
  } else {
    yarnInstall({ projectPath, prod, dev })
      .then(() => {
        task("build project");
        process.chdir(projectPath);

        require("./dev")(getConfig(), instance);
      })
      .catch(err => console.error("Install dependents error: ", err));
  }
};
