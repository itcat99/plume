const { getConfig, debounce } = require("../scripts/helper");
const webpack = require("../scripts/webpack");
const chokidar = require("chokidar");
const path = require("path");
const createModels = require("../scripts/createModels");
const createPagesInfo = require("../scripts/createPagesInfo");

/**
 * 解析文件路径，返回文件名和父级文件名
 * @param {string} filePath 文件路径
 * @return {Object} {name, parentName}
 */
// const parsePath = filePath => {
//   const parsePathArr = filePath.split("/").reverse();
//   return {
//     name: parsePathArr[0],
//     parentName: parsePathArr[1],
//   };
// };

/**
 * 更新models.js文件
 * @param {string} filePath 被更新的文件路径
 * @param {string} rootPath 项目根目录
 * @param {string} plumePath plume目录
 */
// const updateModel = (filePath, rootPath, plumePath) => {
//   const { parentName } = parsePath(filePath);
//   if (parentName === "models") {
//     createModels(rootPath, plumePath);
//   }
// };

module.exports = configFilePath => {
  const config = getConfig(configFilePath);
  const { plume, root, pages } = config.paths;
  const { flow } = config.options;

  require("./init")(configFilePath);

  webpack(config, "development").then(() => {
    /* 当webpackDevServer启动后，检测pages目录的变更，更新路由 */
    const pageWatcher = chokidar.watch(
      [`${pages}/**/*.js`, `${pages}/**/*.jsx`, `${pages}/**/*.json`],
      {
        ignored: path.join(root, "node_modules"),
      },
    );

    pageWatcher.on("all", () => {
      debounce(() => {
        createPagesInfo(pages, plume);
      }, 500);
    });

    if (flow) {
      /* 当启用flow后，检测model文件的变更并更新 */
      const modelWatcher = chokidar.watch(`**/models/**/*.js`, {
        ignored: path.join(root, "node_modules"),
        cwd: root,
      });

      modelWatcher.on("all", () => {
        debounce(() => {
          createModels(root, plume);
        }, 500);
      });
    }
  });
};
