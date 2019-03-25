const fse = require("fs-extra");
const path = require("path");
const createpagesInfo = require("../scripts/createPagesInfo");
const createModels = require("../scripts/createModels");
const { getConfig, isExist } = require("../scripts/helper");
const mkRouter = require("../scripts/mkRouter");
const mkApp = require("../scripts/mkApp");
const mkEntry = require("../scripts/mkEntry");
const mkBabelrc = require("../scripts/mkBabelrc");
/**
 * 初始化plume目录
 * @param {string} configFilePath 手动指定的配置文件路径
 */
module.exports = configFilePath => {
  const config = getConfig(configFilePath);
  const { paths, options } = config;
  const { plume, pages, root } = paths;
  const { flow, target, hashRouter } = options;

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
  mkApp(plume, hashRouter);
  /* 复制errorpages */
  fse.copyFileSync(path.join(__dirname, "../src", "Err404.jsx"), path.join(plume, "404.jsx"));
  /* 创建.babelrc文件 */
  mkBabelrc(root);
};
