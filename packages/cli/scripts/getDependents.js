const dependentsList = require("../constants/dependents");
const devDependentsList = require("../constants/devDependents");

/**
 * 获取安装不同模式下的相应的生产依赖和开发依赖
 *
 * @param {object} opts
 * @param {boolean} opts.flow 是否启用 plumeFlow
 * @param {boolean} opts.eslint 是否启用 eslint
 * @param {boolean} opts.jest 是否启用jest
 * @param {string} opts.mode 模式
 * @param {string} opts.cssMode css模式
 * @param {boolean} opts.cssModules 是否启用cssModules
 * @return {object} 返回 {dependents, devDependents}
 */
module.exports = opts => {
  const { flow, eslint, jest, mode, cssMode, cssModules } = opts;
  let dependents = dependentsList.common;
  let devDependents = [];

  if (mode === "app") {
    dependents = [].concat(dependents, dependentsList.app);
    // devDependents = [].concat(devDependents, devDependentsList.app);
    if (flow) dependents = [].concat(dependents, dependentsList.flow);
    if (cssMode === "styled-components")
      dependents = [].concat(dependents, dependentsList.styledComponents);
  }

  if (mode === "lib") {
    // devDependents = [].concat(devDependents, devDependentsList.lib);

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
  }

  if (cssModules) dependents = [].concat(dependents, dependentsList.cssModules);
  if (jest) devDependents = [].concat(devDependents, devDependentsList.jest);
  if (eslint) devDependents = [].concat(devDependents, devDependentsList.eslint);

  return { dependents, devDependents };
};
