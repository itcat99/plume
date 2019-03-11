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

config 是名为`plume.config.js`的文件，需要`module.exports`输出 config 配置对象

config 还可以是名为`plume.config.json`的json文件

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


## router

- plume根据`pages`目录下的文件夹划分页面，pages目录下的每一个文件夹当作一个页面来看待，需要`index.jsx`作为页面入口。
- 默认`Home`页为入口也，路由体现为`/`
- 其他页面的路由为其页面文件夹的名称的英文小写，例如`About`页面的路由为`/about`
- 暂不支持嵌套路由

plume的典型的目录结构为：

```
.plume
   |- App.js
   |- pagesInfo.json
   |- models.js
   |- index.js
src
  |- pages
     |- Home
        |- index.jsx
     |- page_1
     |- page_2
     |- ...
  |- components
  |- containers
  |- constants
```

则会自动创建如下router

```bash
/ # Home
/page_1 # page_1
/page_2 # page_2

```
打包时，为每一个页面单独打包需要的资源文件。

## @plume/flow && models 

1. 创建 models 的时候，会搜索当前项目下所有`models`目录，目录内的每个`*.js`文件作为一个 model，所以 models 目录下每个 js 文件务必有默认输出 `export defaut`。支持嵌套 models 目录。默认忽略`node_modules`和`.plume`目录。
2. 每个 model 的`namespace`必须是**唯一**的

## TODOS

- [ ] 支持dev下，当新建page页面时，更新pageInfo.json文件
- [ ] 支持dev&&flow下，当新建model时，更新models.js文件
- [ ] 支持嵌套路由
- [ ] 支持动态路由