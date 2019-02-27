#!/usr/bin/env node

const path = require("path");
const program = require("commander");

program.version("0.0.1");

/* 启动开发模式 */
program
  .command("dev")
  .option("-c, --config <path>", "指定plume.config.js文件路径")
  .description("启动开发模式")
  .action(arg => {
    require("./dev")(arg.config);
  });

/* 打包 */
program
  .command("build")
  .description("打包项目")
  .action(() => {
    require("./build")();
  });

/* 对bundle进行分析 */
program
  .command("analyze")
  .description("对bundle进行分析")
  .action(() => {
    require("./analyze");
  });

program.parse(process.argv);
