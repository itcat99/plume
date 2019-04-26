const task = require("../scripts/task");
const installDependents = require("../scripts/installDependents");

/**
 * 安装不同模式下的相应的依赖
 * 
 * @param {object} config
 * @param {string} config.projectPath 项目目录
 * @param {boolean} flow 是否启用 plumeFlow
 * @param {boolean} eslint 是否启用 eslint
 * @param {boolean} jest 是否启用jest
 * @param {string} mode 模式
 */
module.exports = async ({ projectPath, flow, eslint, jest, mode }) => {
  const dependents = ["@babel/runtime", "react", "react-dom"];
  if (mode === "app") {
    dependents.push("react-router-dom", "react-loadable", "axios");
    flow && dependents.push("@plume/flow");
  }

  const devDependents = ["@plume/config", "@plume/core"];
  devDependents.push(mode === "lib" ? "@plume/lib" : "@plume/app");
  jest && devDependents.push("jest");
  eslint &&
    devDependents.push(
      "eslint",
      "babel-eslint",
      "eslint-config-prettier",
      "eslint-plugin-prettier",
      "eslint-plugin-react",
      "precise-commits",
      "prettier",
      "husky",
    );

  try {
    await task("install dependents", installDependents(projectPath, dependents));
    if (devDependents.length)
      await task("install devDependents", installDependents(projectPath, devDependents, true));
  } catch (error) {
    throw new Error(error);
  }
};
