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

config 还可以是名为`plume.config.json`的 json 文件

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
| plume  | string | {root}/.plume | plume 目录   |
| output | string | {root}/dist   | 打包输出目录 |

### options

| name      | type     | default                                                      | desc                                        |
| --------- | -------- | ------------------------------------------------------------ | ------------------------------------------- |
| target    | string   | "root"                                                       | 目标 element 的 ID                          |
| flow      | boolean  | false                                                        | 是否使用 @plume/flow                        |
| gzip      | boolean  | true                                                         | 是否启用 gzip 压缩                          |
| port      | number   | 8080                                                         | 开发模式下，webpack-dev-server 服务器端口号 |
| dll       | boolean  | true                                                         | 是否启用 dll 拆分                           |
| dllName   | string   | "vendor"                                                     | 拆分的 dll 文件名                           |
| dllVendor | string[] | ["react", "react-dom", "react-router-dom", "react-loadable"] | 拆分成 dll 的模块名称数组                   |

## router

- plume 根据`pages`目录下的文件夹划分页面，pages 目录下的每一个文件夹当作一个页面来看待，需要`index.jsx`作为页面入口。
- 子文件夹和文件夹下`.js|.jsx`文件也会作为一个页面来看待，路由为此文件或文件夹在`pages`目录的相对位置。
- 默认`Home`页为入口也，路由体现为`/`
- 其他页面的路由为其页面文件夹的名称的英文小写，例如`About`页面的路由为`/about`
- 暂不支持嵌套路由
- 支持多层路由

例如：

```
假设/pages目录为`pages`目录

则：

目录/pages/Home/index.jsx 生成的路由为 ==> /
目录/pages/About/index.jsx 生成的路由为 ==> /about
目录/pages/About/withMe.jsx 生成的路由为 ==> /about/withme
目录/pages/About/otherAbout/index.jsx 生成的路由为 ==> /about/otherabout

```

plume 的典型的目录结构为：

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
        |- index.jsx
        |- page_1_1.jsx
        |- page_1_sub
           |- index.jsx
           |- page_1_sub_1.jsx
     |- page_2
     |- ...
  |- components
  |- containers
  |- constants
```

则会自动创建如下 router

```bash
/ # Home
/page_1 # page_1
/page_1/page_1_1 # page_1_1
/page_1/page_1_sub # page_1_sub
/page_1/page_1_sub/page_1_sub_1 # page_1_sub_1
/page_2 # page_2

```

打包时，为每一个页面单独打包需要的资源文件。

### dynamic router

在文件或目录名称前加上`$`表示动态路由

例如：

```
|- pages
   |- Dynamic
      |- index.jsx
      |- $id.jsx

```

则会生成

```
/dynamic
/dynamic/:id
```

这样的动态路由

## @plume/flow && models

1. 创建 models 的时候，会搜索当前项目下所有`models`目录，目录内的每个`*.js`文件作为一个 model，所以 models 目录下每个 js 文件务必有默认输出 `export defaut`。支持嵌套 models 目录。默认忽略`node_modules`和`.plume`目录。
2. 每个 model 的`namespace`必须是**唯一**的

## TODOS

- [x] 支持 dev 下，当新建 page 页面时，更新 pageInfo.json 文件
- [x] 支持 dev&&flow 下，当新建 model 时，更新 models.js 文件
- [x] 支持多层路由
- [ ] 支持嵌套路由
- [ ] 支持权限路由
- [x] 支持动态路由
- [x] 支持可选动态路由
