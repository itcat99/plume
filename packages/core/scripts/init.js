const fse = require("fs-extra");
const path = require("path");
const createpagesInfo = require("./createPagesInfo");
const createModels = require("./createModels");
const { relativePostion } = require("../scripts/helper");

/**
 * 创建入口文件
 * @param {boolean} flow 是否启用 plume的flow
 * @param {string} target 目标Element的ID
 * @param {string} plumePath 项目目录下plume目录的绝对路径
 */
const mkEntry = (flow, target, plumePath) => {
  const entryAppPath = flow
    ? path.relative(__dirname, "../src", "index.flow.jsx")
    : path.resolve(__dirname, "../src", "index.jsx");

  const data = fse
    .readFileSync(entryAppPath)
    .toString()
    .replace("{{target}}", target);

  fse.writeFileSync(path.join(plumePath, "index.jsx"), data);
};

/**
 * 创建主应用文件
 * @param {*} plumePath 项目目录下plume目录的绝对路径
 */
const mkApp = plumePath => {
  const originFile = path.join(__dirname, "../src", "App.jsx");
  const targetFile = path.join(plumePath, "App.jsx");

  console.log("origin, target: ", originFile);
  fse.copyFileSync(originFile, targetFile);
};

const mkRouter = (plumePath, pagePath) => {
  const relativePath = relativePostion(plumePath, pagePath);
  const targetFilePath = path.join(plumePath, "Router.jsx");

  const data = fse
    .readFileSync(path.resolve(__dirname, "../src", "Router.jsx"))
    .toString()
    .replace("{{relativePath}}", relativePath);

  console.log("data: ", data);
  fse.writeFileSync(targetFilePath, data);
};

module.exports = config => {
  const { paths, options } = config;
  const { plume, src, pages } = paths;
  const { flow, target } = options;

  fse.mkdirSync(plume);
  mkEntry(flow, target, plume);
  createpagesInfo(pages, plume);
  if (flow) createModels(path.join(src, "models"), plume);
  mkRouter(plume, pages);
  mkApp(plume);
};
