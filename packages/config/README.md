# `config`

> plume的全局配置文件，影响@plume/app @plume/lib @plume/core

## Usage

config 是名为`plume.config.js`的文件，需要`module.exports`输出 config 配置对象，不可使用es6导出语法

~~config 还可以是名为`plume.config.json`的 json 文件~~ 由于加入了webpack选项，所以只能使用.js文件

config 文件放置在项目根目录，可以在 cli 内不配置`--config`选项

| name    | type     | desc                |
| ------- | -------- | ------------------- |
| paths   | object   | 各种目录的配置对象  |
| options | object   | 各种选项的配置对象  |
| webpack | function | 自定义 webpack 配置 |

### paths

| name       | type   | default          | desc         |
| ---------- | ------ | ---------------- | ------------ |
| root       | string | process.cwd()    | 项目根目录   |
| src        | string | {root}/src       | 开发目录     |
| pages      | string | {src}/pages      | 页面目录     |
| plume      | string | {root}/.plume    | plume 目录   |
| output     | string | {root}/dist      | 打包输出目录 |
| assets     | string | {dist}/assets    | 静态资源目录 |
| components | string | {src}/components | 组件目录     |
| containers | string | {src}/containers | 包装组件目录 |

### options

| name       | type                                   | default                                                      | desc                                                           |
| ---------- | -------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- |
| target     | string                                 | "root"                                                       | 目标 element 的 ID                                             |
| flow       | boolean                                | false                                                        | 是否使用 @plume/flow                                           |
| gzip       | boolean                                | true                                                         | 是否启用 gzip 压缩                                             |
| port       | number                                 | 8080                                                         | 开发模式下，webpack-dev-server 服务器端口号                    |
| dll        | boolean                                | true                                                         | 是否启用 dll 拆分                                              |
| dllName    | string                                 | "vendor"                                                     | 拆分的 dll 文件名                                              |
| dllVendor  | string[]                               | ["react", "react-dom", "react-router-dom", "react-loadable"] | 拆分成 dll 的模块名称数组                                      |
| assetsExt  | string[]                               | ["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"]    | 静态资源后缀                                                   |
| hashRouter | boolean                                | false                                                        | 使用hashRouter，默认为browserRouter                            |
| progress   | boolean                                | true                                                         | 编译时显示进度条                                               |
| entry      | null \| function \| object \| string[] | null                                                         | 配置入口文件，当没有配置时，使用{plume}/index.jsx 作为默认入口 |
| lib        | null \| string                         | null                                                         | 当值为string类型时，打包为组件库，名称为设置的值               |

### webpack

| name    | type             | default | signature                                                        | desct                                                                                |
| ------- | ---------------- | ------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| webpack | null \| function | null    | null \| (webpack_config: object, plume_config: object) => object | 当 webpack 是函数的时候，接受当前的 webpack 配置和 plume 配置，输出新的 webpack 配置 |