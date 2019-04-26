/* eslint no-console:0 */
const path = require("path");
// const axios = require("axios");
const fse = require("fs-extra");
const { getConfig, isExist, debounce } = require("./scripts/helper");
const mkApp = require("./scripts/mkApp");
const mkBabelrc = require("./scripts/mkBabelrc");
const mkEntry = require("./scripts/mkEntry");
const mkRouter = require("./scripts/mkRouter");
const createPagesInfo = require("./scripts/createPagesInfo");
const createModels = require("./scripts/createModels");
const core = require("@plume/core");
const chokidar = require("chokidar");
const chalk = require("chalk");

/**
 * 初始化app
 * @param {string} customConfig 手动指定的配置文件路径
 */
class App {
  constructor(customConfig) {
    this.customConfig = customConfig;

    this.init();
  }

  init() {
    const config = getConfig(this.customConfig);
    const { paths, app } = config;
    const { plume, pages, root } = paths;
    const { target, hashRouter, flow } = app;

    this.config = config;

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
    createPagesInfo(pages, plume);
    /* 如果开启flow模式，则根据配置创建models.js文件 */
    flow && createModels(root, plume);
    /* 创建Router.js文件 */
    mkRouter(plume, pages);
    /* 创建主应用 App.jsx文件 */
    mkApp(plume, hashRouter);
    /* 复制errorpages */
    fse.copyFileSync(path.join(__dirname, "src", "Err404.jsx"), path.join(plume, "404.jsx"));
    /* 创建.babelrc文件 */
    mkBabelrc(root);
  }

  dev() {
    const { pages, root, plume } = this.config.paths;
    const { flow } = this.config.options;

    core(this.config)
      .dev("webpack")
      .then(() => {
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
      })
      .catch(err => console.error("dev err: ", err));
  }

  build() {
    core(this.config)
      .build("webpack")
      .catch(err => console.log(chalk.red(`[WEBPACK BUILD ERROR] ==> ${err}`)));
  }
}

module.exports = App;
// exports.axios = axios;
