const path = require("path");
const template = require("./template");
const fse = require("fs-extra");

/**
 * 创建入口文件
 * @param {boolean} flow 是否启用 plume的flow
 * @param {string} target 目标Element的ID
 * @param {string} plumePath 项目目录下plume目录的绝对路径
 */
module.exports = (flow, target, plumePath) => {
  console.log("flow: ", flow);
  const entryAppPath = flow
    ? path.resolve(__dirname, "../src", "index.flow.jsx")
    : path.resolve(__dirname, "../src", "index.jsx");

  const data = template(entryAppPath, {
    target,
  });

  fse.writeFileSync(path.join(plumePath, "index.jsx"), data);
};
