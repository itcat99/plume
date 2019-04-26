const task = require("../scripts/task");
const installDependents = require("../scripts/installDependents");

module.exports = async ({ projectPath, flow, eslint, jest, mode }) => {
  const dependents = ["@babel/runtime", "react", "react-dom"];

  mode === "app" && dependents.push("react-router-dom", "react-loadable", "axios");
  flow && dependents.push("@plume/flow");
  const devDependents = jest ? ["jest"] : [];

  try {
    await task("install dependents", installDependents(projectPath, dependents));
    if (eslint) {
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
    }
    if (devDependents.length)
      await task("install devDependents", installDependents(projectPath, devDependents, true));
  } catch (error) {
    throw new Error(error);
  }
};
