#!/usr/bin/env node
const program = require("commander");
const inquirer = require("inquirer");
const path = require("path");
const pkg = require("../package.json");
const { getConfig, spawn, task } = require("@plume/helper");

program.version(pkg.version, "-v,--version");

/* 创建新项目 */
program
  .command("create <name>")
  .description("创建新项目，<name>指定项目名称")
  .option("-p | --path <path>", "指定新建项目目录，默认在当前目录下")
  .option("-s | --skip", "跳过安装依赖的步骤，手动安装")
  .action((name, args) => {
    const { path: customPath, skip } = args;
    let targetPath = customPath;

    inquirer
      .prompt([
        {
          type: "list",
          name: "mode",
          choices: ["app", "lib"],
          message: "选择开发项目的模式",
          default: 0,
        },
        {
          type: "list",
          name: "cssMode",
          choices: ["sass", "styled-components", "less", "css"],
          message: "选择css模式",
        },
        {
          type: "confirm",
          name: "cssModules",
          message: "是否启用cssModules？",
          when: answers => {
            const { cssMode } = answers;
            return cssMode === "sass" || cssMode === "less" || cssMode === "css";
          },
        },
        {
          type: "checkbox",
          name: "options",
          choices: ["@plume/flow", "eslint", "jest"],
          message: "选择你需要的模块",
          default: ["eslint"],
        },
        {
          type: "confirm",
          name: "skip",
          message: "是否跳过安装依赖？随后可以手动安装项目依赖",
          default: false,
          when: answers => !answers.skip,
        },
      ])
      .then(answers => {
        const { options, mode, cssMode, cssModules, skip: doSkip } = answers;
        const flow = options.indexOf("@plume/flow") >= 0;
        const eslint = options.indexOf("eslint") >= 0;
        const jest = options.indexOf("jest") >= 0;

        if (customPath && !path.isAbsolute(customPath)) {
          targetPath = path.join(process.cwd(), customPath);
        }

        const opts = {
          name,
          targetPath: targetPath || process.cwd(),
          flow: mode === "lib" ? false : flow,
          eslint,
          jest,
          skip: doSkip || skip,
          mode,
          cssMode,
          cssModules,
        };

        require("./create")(opts);
      });
  });

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
    const config = getConfig(customConfig, cwd);

    require("./add")({ name, types: { container, page, model }, targetPath, config });
  });

/* 初始化plume */
program
  .command("init")
  .description("初始化plume文件")
  .option("-c | --config <path>", "指定plume.config.js文件路径")
  .action(args => {
    const { config: customConfig, cwd } = args;
    const config = getConfig(customConfig, cwd);

    require("./init")(config);
  });

/* 启动开发模式 */
program
  .command("dev")
  .description("启动开发模式")
  .option("-c | --config <path>", "指定plume.config.js文件路径")
  .action(args => {
    const { config: customConfig, cwd } = args;
    const config = getConfig(customConfig, cwd);

    require("./dev")(config);
  });

/* 打包 */
program
  .command("build")
  .description("打包项目")
  .option("-c | --config <path>", "指定plume.config.js文件路径")
  .option("--cwd", "设置cwd，当config配置为相对路径时，则从此处搜索，默认为process.cwd()")
  .action(args => {
    const { config: customConfig, cwd } = args;
    const config = getConfig(customConfig, cwd);

    require("./build")(config);
  });

program
  .command("upgrade")
  .description("升级plume-cli")
  .action(async () => {
    try {
      await task("remove @plume/cli", spawn("npm", ["uninstall", "-g", "@plume/cli"]));
      await task("install new @plume/cli", spawn("npm", ["i", "-g", "@plume/cli"]));
    } catch (err) {
      throw new Error(err);
    }
  });

program.parse(process.argv);
