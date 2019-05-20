/* eslint no-console:0 */
const path = require("path");
const fse = require("fs-extra");
const { isExist, debounce, task } = require("@plume/helper");
const mkApp = require("./scripts/mkApp");
const mkBabelrc = require("./scripts/babelConfig");
const mkEntry = require("./scripts/mkEntry");
const mkRouter = require("./scripts/mkRouter");
const createPagesInfo = require("./scripts/createPagesInfo");
const createModels = require("./scripts/createModels");
const chokidar = require("chokidar");
const chalk = require("chalk");
const webpack = require("./scripts/webpack");
const DEFAULT_CONFIG = require("@plume/config")("app");

/**
 * 初始化app
 * @param {string} config plume配置
 */
class App {
  constructor(config = DEFAULT_CONFIG) {
    this.config = config;
    this.init();
  }

  init() {
    const { paths, options } = this.config;
    const { plume, pages, root } = paths;
    const { target, hashRouter, flow } = options;

    /* 创建.plume目录 */
    if (isExist(plume)) {
      fse.removeSync(plume);
    }

    task("create .plume directory", fse.mkdirSync(plume));
    /* 创建入口文件 index.jsx */
    task("create entry file", mkEntry(flow, target, plume));
    /* 创建页面目录的信息文件 pagesInfo.json */
    task("create pagesInfo file", createPagesInfo(pages, plume));
    /* 如果开启flow模式，则根据配置创建models.js文件 */
    flow && task("create models file ", createModels(root, plume));
    /* 创建Router.js文件 */
    task("create Router file", mkRouter(plume, pages));
    /* 创建主应用 App.jsx文件 */
    task("create app main file", mkApp(plume, hashRouter));
    /* 复制errorpages */
    task(
      "copy errorpages",
      fse.copyFileSync(path.join(__dirname, "src", "Err404.jsx"), path.join(plume, "404.jsx")),
    );
    /* 创建.babelrc文件 */
    task("create .babelrc file", mkBabelrc(root));
  }

  dev() {
    const { pages, root, plume } = this.config.paths;
    const { flow } = this.config.options;

    webpack(this.config, true)
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
    webpack(this.config).catch(err => console.log(chalk.red(`[WEBPACK BUILD ERROR] ==> ${err}`)));
  }
}

module.exports = App;
