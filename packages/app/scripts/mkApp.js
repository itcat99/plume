const path = require("path");
const template = require("./template");
const fse = require("fs-extra");

/**
 * 创建主应用文件
 * @param {string} plumePath 项目目录下plume目录的绝对路径
 * @param {boolean} hashRouter 是否启用hashRouter
 * @param {string} basename 基础路由
 */
module.exports = (plume, hashRouter, basename) => {
  const originFile = path.join(__dirname, "../templates/plume", "App.jsx");
  const targetFile = path.join(plume, "App.jsx");

  const data = template(originFile, {
    hashRouter: `${hashRouter ? true : false}`,
    basename,
  });

  fse.writeFileSync(targetFile, data);
};
