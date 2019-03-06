# `plume`

> TODO: description

## Install

```bash
yarn add @plume/core -D

# or
npm install @plume/core --dev
```

## Usage

```bash
plume-core dev # 启用开发服务器

plume-core build # 打包
```

## Cli

--config 后跟自定义的配置文件路径

`plume-core init [--config <CONFIG_PATH>]`：初始化 plume 目录，这会在项目根目录创建`.plume`文件夹。内含运行项目必要的文件。

`plume-core dev [--config <CONFIG_PATH>]`：启用开发服务器

`plume-core build [--config <CONFIG_PATH>]`：打包

`plume < -h | --help >`: 查看帮助

## config

config 是名为`plume.config.js`的文件，需要`module export`输出 config 配置对象

config 文件放置在项目根目录，可以在 cli 内不配置`--config`选项

| name    | type   | desc               |
| ------- | ------ | ------------------ |
| paths   | object | 各种目录的配置对象 |
| options | object | 各种选项的配置对象 |

### paths

| name   | type   | default       | desc         |
| ------ | ------ | ------------- | ------------ |
| root   | string | process.cwd() | 项目根目录   |
| src    | string | {root}/src    | 开发目录     |
| pages  | string | {src}/pages   | 页面目录     |
| plume  | string | {root}/.plume | plume目录    |
| output | string | {root}/dist   | 打包输出目录 |

### options

| name      | type     | default                                                      | desc                                       |
| --------- | -------- | ------------------------------------------------------------ | ------------------------------------------ |
| target    | string   | "root"                                                       | 目标element的ID                            |
| flow      | boolean  | false                                                        | 是否使用 @plume/flow                       |
| gzip      | boolean  | true                                                         | 是否启用gzip压缩                           |
| port      | number   | 8080                                                         | 开发模式下，webpack-dev-server服务器端口号 |
| dll       | boolean  | true                                                         | 是否启用dll拆分                            |
| dllName   | string   | "vendor"                                                     | 拆分的dll文件名                            |
| dllVendor | string[] | ["react", "react-dom", "react-router-dom", "react-loadable"] | 拆分成dll的模块名称数组                    |

## 注意事项 ⚠️

### models

1. 创建 models 的时候，会搜索当前项目下所有`models`目录，目录内的每个`*.js`文件作为一个 model，所以 models 目录下每个 js 文件务必有默认输出 `export defaut`。支持嵌套 models 目录。默认忽略`node_modules`和`.plume`目录。
2. 每个 model 的`namespace`必须是**唯一**的。
3. model 的 effect 必须是`async/await`函数
