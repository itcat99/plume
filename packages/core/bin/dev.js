const { getConfig, debounce } = require("../scripts/helper");
const webpack = require("../scripts/webpack");
const chokidar = require("chokidar");
const path = require("path");
const createModels = require("../scripts/createModels");
const createPagesInfo = require("../scripts/createPagesInfo");
const mkRouter = require("../scripts/mkRouter");

module.exports = configFilePath => {
  const config = getConfig(configFilePath);
  const { plume, root, pages } = config.paths;
  const { flow } = config.options;

  require("./init")(configFilePath);

  webpack(config, "development").then(() => {
    /* 当webpackDevServer启动后，检测pages目录的变更，更新路由 */
    const pageWatcher = chokidar.watch([`${pages}/**/*`], {
      ignored: path.join(root, "node_modules"),
    });

    pageWatcher.on(
      "all",
      debounce((_event, file) => {
        if (file.indexOf(pages) >= 0) {
          const page404Match = file.replace(pages, "").match(/404/);

          if (page404Match && page404Match.index === 1) {
            mkRouter(plume, pages);
          }
        }

        createPagesInfo(pages, plume);
      }, 400),
    );

    if (flow) {
      /* 当启用flow后，检测model文件的变更并更新 */
      const modelWatcher = chokidar.watch(`**/models/**/*.js`, {
        ignored: path.join(root, "node_modules"),
        cwd: root,
      });

      modelWatcher.on(
        "all",
        debounce(() => {
          createModels(root, plume);
        }, 500),
      );
    }
  });
};
