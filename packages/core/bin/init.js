const fse = require("fs-extra");
const path = require("path");
const createpagesInfo = require("../scripts/createPagesInfo");
const createModels = require("../scripts/createModels");
const { relativePostion } = require("../scripts/helper");
const { getConfig, isExist } = require("../scripts/helper");
const template = require("../scripts/template");

/**
 * 创建入口文件
 * @param {boolean} flow 是否启用 plume的flow
 * @param {string} target 目标Element的ID
 * @param {string} plumePath 项目目录下plume目录的绝对路径
 */
const mkEntry = (flow, target, plumePath) => {
  const entryAppPath = flow
    ? path.resolve(__dirname, "../src", "index.flow.jsx")
    : path.resolve(__dirname, "../src", "index.jsx");

  const data = template(entryAppPath, {
    target,
  });

  fse.writeFileSync(path.join(plumePath, "index.jsx"), data);
};

/**
 * 创建主应用文件
 * @param {*} plumePath 项目目录下plume目录的绝对路径
 */
const mkApp = plumePath => {
  const originFile = path.join(__dirname, "../src", "App.jsx");
  const targetFile = path.join(plumePath, "App.jsx");

  fse.copyFileSync(originFile, targetFile);
};

const mkRouter = (plumePath, pagePath) => {
  const relativePath = relativePostion(plumePath, pagePath);
  const targetFilePath = path.join(plumePath, "Router.jsx");

  const data = template(path.resolve(__dirname, "../src", "Router.jsx"), {
    relativePath,
  });

  fse.writeFileSync(targetFilePath, data);
};

const mkBabelrc = rootPath => {
  const babelrcPath = path.join(rootPath, ".babelrc");
  if (!isExist(babelrcPath)) {
    fse.copyFileSync(path.resolve(__dirname, "../config", ".babelrc"), babelrcPath);
  }
};

/**
 * 初始化plume目录
 * @param {string} configFilePath 手动指定的配置文件路径
 */
module.exports = configFilePath => {
  const config = getConfig(configFilePath);
  const { paths, options } = config;
  const { plume, pages, root } = paths;
  const { flow, target } = options;

  /* 创建.plume目录 */
  if (isExist(plume)) {
    fse.removeSync(plume);
  }
  fse.mkdirSync(plume);
  /* 创建配置文件 */
  fse.writeFileSync(
    path.join(plume, "config.js"),
    `module.exports = ${JSON.stringify(config, null, 2)}`,
  );
  /* 创建入口文件 index.jsx */
  mkEntry(flow, target, plume);
  /* 创建页面目录的信息文件 pagesInfo.json */
  createpagesInfo(pages, plume);
  /* 如果开启flow模式，则根据配置创建models.js文件 */
  if (flow) createModels(root, plume);
  /* 创建Router.js文件 */
  mkRouter(plume, pages);
  /* 创建主应用 App.jsx文件 */
  mkApp(plume);
  /* 创建.babelrc文件 */
  mkBabelrc(root);
};
