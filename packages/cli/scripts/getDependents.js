const dependentsList = require("../scripts/dependents");
const devDependentsList = require("../scripts/devDependents");

module.exports = opts => {
  const { flow, eslint, jest, mode, cssMode, cssModules } = opts;
  let dependents = dependentsList.common;
  let devDependents = devDependentsList.common;

  if (mode === "app") {
    dependents = [].concat(dependents, dependentsList.app);
    devDependents = [].concat(devDependents, devDependentsList.app);
    if (flow) dependents = [].concat(dependents, dependentsList.flow);
  }

  if (mode === "lib") {
    devDependents = [].concat(devDependents, devDependentsList.lib);

    // fixed docz plugin css BUG https://github.com/pedronauck/docz/issues/793#issuecomment-484753158
    devDependents.push("react-hot-loader");

    switch (cssMode) {
      case "sass":
        devDependents = [].concat(devDependents, devDependentsList.sass);
        break;
      case "less":
        devDependents = [].concat(devDependents, devDependentsList.less);
        break;
      case "styled-components":
        dependents = [].concat(dependents, dependentsList.styledComponents);
        break;
      default:
        break;
    }

    if (cssModules) dependents = [].concat(dependents, dependentsList.cssModules);
  }

  if (jest) devDependents = [].concat(devDependents, devDependentsList.jest);
  if (eslint) devDependents = [].concat(devDependents, devDependentsList.eslint);

  return { dependents, devDependents };
};
