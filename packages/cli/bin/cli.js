#!/usr/bin/env node
const program = require("commander");
const inquirer = require("inquirer");

program.version("0.0.1");

/* 创建新项目 */
program
  .command("create <name> [path]")
  .description("创建新项目，<name>指定项目名称，[path]指定新建项目地址，默认在当前目录下。")
  .action((name, path) => {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "flow",
          message: "do you want to use @plume/flow?",
        },
      ])
      .then(answers => {
        const { flow } = answers;
        require("./create")(name, path || process.cwd(), flow);
      });
  });

program
  .command("add <name> [path]")
  .description(
    "新建模块，<name>指定项目名称，[path]指定新建模块地址，默认在@plume/core的config文件指定地址。",
  )
  .option(
    "-c, --container | -p, --page | -m, --model",
    "[-c]创建container组件， [-p]创建page页面，[-m]创建model模块。",
  )
  .action((name, path, args) => {
    const { container, page, model } = args;

    require("./add")(name, path, { container, page, model });
  });
program.parse(process.argv);
