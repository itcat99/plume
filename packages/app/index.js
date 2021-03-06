/* eslint no-console:0 */
const path = require("path");
const Core = require("@plume/core");
const { isExist, debounce, deepAssign, getConfig } = require("@plume/helper");
const fse = require("fs-extra");
const mkApp = require("./scripts/mkApp");
const mkBabelrc = require("./scripts/babelConfig");
const mkEntry = require("./scripts/mkEntry");
const mkRouter = require("./scripts/mkRouter");
// const createPagesInfo = require("./scripts/createPagesInfo");
const createPageInfo = require("./scripts/createPageInfo");
const createModels = require("./scripts/createModels");
const chokidar = require("chokidar");
const chalk = require("chalk");
const webpack = require("./scripts/webpack");

class App extends Core {
  constructor(rootPath) {
    super(rootPath);

    const { src, root } = this.config.paths;
    const plume = path.join(root, ".plume");
    const pages = path.join(src, "pages");
    const components = path.join(src, "components");
    const containers = path.join(src, "containers");
    const modules = path.join(src, "modules");
    const srcAssets = path.join(src, "assets");

    this.config = deepAssign(this.config, {
      paths: {
        plume,
        components,
        containers,
        pages,
        modules,
        srcAssets,
      },
      options: {
        entry: null,
        analyzer: false,
        target: "root",
        flow: false,
        webpack: null,
        dll: true,
        dllName: "vendor",
        assetsExt: ["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"],
        assetsIgnore: [],
        dllVendor: ["react", "react-dom", "react-router-dom", "react-loadable"],
        hashRouter: false,
        gzip: true,
        proxy: null,
        publicPath: "/",
        title: "production",
        externals: [],
        basename: "",
        alias: {
          _components: components,
          _plume: plume,
          _containers: containers,
          _pages: pages,
          _modules: modules,
          _assets: srcAssets,
        },
      },
    });
  }

  dependents(opts) {
    const { dev, prod, cssMode } = super.dependents(opts);

    prod.push("react", "react-dom", "react-router-dom", "react-loadable", "axios");

    dev.push(
      "@babel/core",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/preset-env",
      "@babel/preset-react",
      "babel-loader",
      "core-js",
      "css-loader",
      "file-loader",
      "@babel/plugin-syntax-dynamic-import",
      "happypack",
      "handlebars-loader",
      "regenerator",
      "style-loader",
      "postcss-loader",
    );

    cssMode === "sass" && dev.push("sass-loader", "node-sass");
    cssMode === "less" && dev.push("less-loader", "less");

    return {
      prod,
      dev,
    };
  }

  initial(opts) {
    super.initial(opts);
    this.config = deepAssign(this.config, {
      mode: opts.mode,
      options: {
        flow: opts.flow,
        cssMode: opts.cssMode,
        cssModules: opts.cssModules,
        styledComponents: opts.styledComponents,
      },
    });

    const { root } = this.config.paths;
    const { flow } = this.config.options;

    this.task("copy templates", this.copyTemp(root, flow));

    this.createFiles();
  }

  createFiles() {
    const { paths, options } = this.config;
    const { plume, root, pages, src } = paths;
    const { target, hashRouter, flow, basename } = options;
    let wrapperPath = path.join(src, "_Wrapper.jsx");

    /* 创建.plume目录 */
    if (isExist(plume)) {
      fse.removeSync(plume);
    }
    if (!isExist(wrapperPath)) {
      wrapperPath = null;
    }

    this.task("create .plume directory", fse.mkdirSync(plume));
    /* 创建入口文件 index.jsx */
    this.task("create entry file", mkEntry(flow, target, plume, wrapperPath));
    /* 创建页面目录的信息文件 pagesInfo.json */
    this.task("create pagesInfo file", createPageInfo(pages, plume));
    /* 如果开启flow模式，则根据配置创建models.js文件 */
    flow && this.task("create models file ", createModels(root, plume));
    /* 创建Router.js文件 */
    this.task("create Router file", mkRouter(plume, pages));
    /* 创建主应用 App.jsx文件 */
    this.task("create app main file", mkApp(plume, hashRouter, basename));
    /* 复制errorpages */
    this.task(
      "copy errorpages",
      fse.copyFileSync(
        path.join(__dirname, "templates/plume", "Err404.jsx"),
        path.join(plume, "404.jsx"),
      ),
    );
    /* 创建.babelrc文件 */
    this.task("create .babelrc file", mkBabelrc(root));
  }

  dev(config) {
    super.dev(config);
    this.createFiles();

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
          debounce(() => {
            createPageInfo(pages, plume);
            mkRouter(plume, pages);
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

  build(config) {
    super.build(config);
    this.createFiles();
    webpack(this.config).catch(err => console.log(chalk.red(`[WEBPACK BUILD ERROR] ==> ${err}`)));
  }

  registerCli(program) {
    program
      .command("add <name> [path]")
      .description(
        "新建模块，<name>指定项目名称，[path]指定新建模块地址，默认在@plume/core的config文件指定地址。",
      )
      .option("-c | --config <path>", "指定plume.config.js文件路径")
      .option("-C | --container", "创建container组件")
      .option("-P | --page", "创建page页面")
      .option("-M | --model", "创建model模块")
      .action((name, targetPath, args) => {
        const { container, page, model, config: customConfig, cwd } = args;
        const config = deepAssign(this.config, getConfig(customConfig, cwd));

        require("./scripts/add")({ name, types: { container, page, model }, targetPath, config });
      });
  }

  copyTemp(targetPath, flow) {
    const tempName = flow ? "app-flow" : "app";
    const tempPath = path.resolve(__dirname, "templates", tempName);

    fse.copySync(tempPath, targetPath);
  }
}

module.exports = App;
