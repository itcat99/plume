const { path } = require("@plume/helper");
const template = require("./template");
const fse = require("fs-extra");

/**
 * 创建入口文件
 * @param {boolean} flow 是否启用 plume的flow
 * @param {string} target 目标Element的ID
 * @param {string} plumePath 项目目录下plume目录的绝对路径
 * @param {string} wrapperPath 项目目录下Wrapper文件的绝对路径
 */
module.exports = (flow, target, plumePath, wrapperPath) => {
  const entryAppPath = flow
    ? path.resolve(__dirname, "../templates/plume", "index.flow.jsx")
    : path.resolve(__dirname, "../templates/plume", "index.jsx");

  const data = template(entryAppPath, {
    target,
    app: wrapperPath ? path.relative(plumePath, wrapperPath) : "./App",
  });

  fse.writeFileSync(path.join(plumePath, "index.jsx"), data);
};
