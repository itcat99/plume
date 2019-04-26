# `config`

> plume 的全局配置文件，影响@plume/app @plume/lib @plume/core

## Usage

config 是名为`plume.config.js`的文件，需要`module.exports`输出 config 配置对象，不可使用 es6 导出语法

~~config 还可以是名为`plume.config.json`的 json 文件~~ 由于加入了 webpack 选项，所以只能使用.js 文件

config 文件放置在项目根目录，可以在 cli 内不配置`--config`选项

| name    | type           | desc               |
| ------- | -------------- | ------------------ |
| paths   | object         | 各种目录的配置对象 |
| options | object         | 通用的配置选项     |
| app     | null \| object | app 模式的配置选项 |
| lib     | null \| object | lib 模式的配置选项 |
| ~~      | webpack        | function           | 自定义 webpack 配置 | ~~ |
| ~~      | rollup         | function           | 自定义rollup配置    | ~~ |

### paths

| name       | type   | default          | desc                                                                       |
| ---------- | ------ | ---------------- | -------------------------------------------------------------------------- |
| root       | string | process.cwd()    | 项目根目录                                                                 |
| src        | string | {root}/src       | 开发目录                                                                   |
| pages      | string | {src}/pages      | 页面目录                                                                   |
| plume      | string | {root}/.plume    | plume 目录                                                                 |
| output     | string | {root}/dist      | 打包输出目录                                                               |
| assets     | string | {dist}/assets    | 静态资源目录                                                               |
| components | string | {src}/components | 组件目录。在app模式下，作为静态组件的目录；在lib模式下，作为独立组件的目录 |
| containers | string | {src}/containers | 包装组件目录                                                               |

### options

| name      | type                                      | default                                                   | desc                                                                                                                                                                |
| --------- | ----------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| flow      | boolean                                   | false                                                     | 是否使用 @plume/flow                                                                                                                                                |
| gzip      | boolean                                   | true                                                      | 是否启用 gzip 压缩                                                                                                                                                  |
| port      | number                                    | 8080                                                      | 开发模式下，webpack-dev-server 服务器端口号                                                                                                                         |
| assetsExt | string[]                                  | ["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"] | 静态资源后缀                                                                                                                                                        |
| progress  | boolean                                   | true                                                      | 编译时显示进度条                                                                                                                                                    |
| entry     | null \| function \| object \|string[]     | null                                                      | 配置入口文件，当没有配置时，app模式下使用{plume}/index.jsx 作为默认入口；lib模式下使用{src}/index.js 和{components}目录下每个`文件夹`内的index.jsx 文件作为默认入口 |
| externals | null \| String \| Array \| Object \| Regx | null                                                      | 配置外部依赖，当app模式时同webpack的externals配置，当lib模式时同rollup的external                                                                                    |

#### entry: Function

当entry为function时，函数签名为：

`(plume_config:object) => null|object|string[]|string`

plume_config 为plume的配置选项

### app

| name       | type             | default                                                      | desc                                  |
| ---------- | ---------------- | ------------------------------------------------------------ | ------------------------------------- |
| target     | string           | root                                                         | 目标 element 的 ID                    |
| dll        | boolean          | true                                                         | 是否启用 dll 拆分                     |
| dllName    | string           | "vendor"                                                     | 拆分的 dll 文件名                     |
| dllVendor  | string[]         | ["react", "react-dom", "react-router-dom", "react-loadable"] | 拆分成 dll 的模块名称数组             |
| hashRouter | boolean          | false                                                        | 使用 hashRouter，默认为 browserRouter |
| webpack    | null \| function | null                                                         | 自定义 webpack 配置                   |

#### webpack

| name    | type             | default | signature                                                        | desc                                                                                 |
| ------- | ---------------- | ------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| webpack | null \| function | null    | null \| (webpack_config: object, plume_config: object) => object | 当 webpack 是函数的时候，接受当前的 webpack 配置和 plume 配置，输出新的 webpack 配置 |

### lib

| name   | type             | default | desc              |
| ------ | ---------------- | ------- | ----------------- |
| rollup | null \| function | null    | 自定义rollup 配置 |

#### rollup

| name   | type             | default | signature                                                                             | desc          |
| ------ | ---------------- | ------- | ------------------------------------------------------------------------------------- | ------------- |
| rollup | null \| function | null    | null \| (rollup_config: object\|object[], plume_config: object) => object \| object[] | 用法同webpack |