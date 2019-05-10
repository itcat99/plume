#!/usr/bin/env node
const program = require("commander");
const inquirer = require("inquirer");
const path = require("path");
const pkg = require("../package.json");
const { getConfig } = require("@plume/helper");

program.version(pkg.version, "-v,--version");

/* 创建新项目 */
program
  .command("create <name>")
  .description("创建新项目，<name>指定项目名称")
  .option("-p, --path <path>", "指定新建项目目录，默认在当前目录下")
  .option("-s, --skip", "跳过安装依赖的步骤，手动安装")
  .action((name, args) => {
    const { path: customPath, skip } = args;
    let targetPath = customPath;

    inquirer
      .prompt([
        {
          type: "list",
          name: "mode",
          choices: ["app", "lib"],
          message: "please select the project mode",
          default: 0,
        },
        {
          type: "list",
          name: "cssMode",
          choices: ["sass", "styled-components", "less", "css"],
          message: "please select the css mode",
          // when: answers => answers.mode === "lib",
        },
        {
          type: "confirm",
          name: "cssModules",
          message: "Do you want to use css modules?",
          when: answers => {
            const { cssMode } = answers;
            return cssMode === "sass" || cssMode === "less" || cssMode === "css";
          },
        },
        {
          type: "checkbox",
          name: "options",
          choices: ["@plume/flow", "eslint", "jest"],
          message: "please select the option you need",
          default: ["eslint"],
        },
        {
          type: "confirm",
          name: "skip",
          message: "Do you want to skip install dependents?",
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
  .option("-l | --lib", "指定项目的模式为 lib，默认的项目模式为 app")
  .option("-c | --container", "创建container组件")
  .option("-p | --page", "创建page页面")
  .option("-m | --model", "创建model模块")
  .action((name, targetPath, args) => {
    const { container, page, model } = args;
    require("./add")(name, { container, page, model }, targetPath);
  });

/* 初始化plume */
program
  .command("init")
  .option("-l, --lib", "指定项目的模式为 lib，默认的项目模式为 app")
  .option("-c, --config <path>", "指定plume.config.js文件路径")
  .description("初始化plume文件")
  .action(args => {
    const { config: customConfig, lib, cwd } = args;
    const mode = lib ? "lib" : "app";
    const config = getConfig(customConfig, cwd);

    require("./init")(config, mode);
  });

/* 启动开发模式 */
program
  .command("dev")
  .option("-l, --lib", "指定项目的模式为 lib，默认的项目模式为 app")
  .option("-c, --config <path>", "指定plume.config.js文件路径")
  .description("启动开发模式")
  .action(args => {
    const { config: customConfig, lib, cwd } = args;
    const mode = lib ? "lib" : "app";
    const config = getConfig(customConfig, cwd);

    require("./dev")(config, mode);
  });

/* 打包 */
program
  .command("build")
  .option("-l, --lib", "指定项目的模式为 lib，默认的项目模式为 app")
  .option("-c, --config <path>", "指定plume.config.js文件路径")
  .option("--cwd", "设置cwd，当config配置为相对路径时，则从此处搜索，默认为process.cwd()")
  .description("打包项目")
  .action(args => {
    const { config: customConfig, lib, cwd } = args;
    const mode = lib ? "lib" : "app";
    const config = getConfig(customConfig, cwd);

    require("./build")(config, mode);
  });

program.parse(process.argv);
