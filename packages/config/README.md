# `config`

> plume 的全局配置文件，影响@plume/app @plume/lib @plume/core

## Usage

config 是名为`plume.config.js`的文件，需要`module.exports`输出 config 配置对象，不可使用 es6 导出语法。

~~config 还可以是名为`plume.config.json`的 json 文件~~ 由于加入了 webpack 选项，所以只能使用.js 文件。

config 文件放置在项目根目录，可以在 cli 内部配置`--config`选项。

| name    | type    | desc                           |
| ------- | ------- | ------------------------------ |
| mode    | string  | 项目模式 app \| lib 默认为 app |
| paths   | object  | 各种目录的配置对象             |
| options | object  | 通用的配置选项                 |
| ~~      | app     | null \| object                 | app 模式的配置选项 | ~~ |
| ~~      | lib     | null \| object                 | lib 模式的配置选项 | ~~ |
| ~~      | webpack | function                       | 自定义 webpack 配置 | ~~ |
| ~~      | rollup  | function                       | 自定义 rollup 配置 | ~~ |

### mode

项目的模式，`app`|`lib`二选一，影响打包和开发。默认为`app`。

### paths

| name       | type   | default          | desc                                        |
| ---------- | ------ | ---------------- | ------------------------------------------- |
| root       | string | process.cwd()    | 项目根目录                                  |
| src        | string | {root}/src       | 开发目录                                    |
| pages      | string | {src}/pages      | 页面目录                                    |
| plume      | string | {root}/.plume    | plume 目录                                  |
| output     | string | {root}/dist      | 打包输出目录                                |
| assets     | string | {dist}/assets    | 静态资源目录                                |
| components | string | {src}/components | 组件目录。在 app 模式下，作为静态组件的目录 |
| containers | string | {src}/containers | 包装组件目录                                |

### options

options 根据`mode`的不同，分别又不同的选项

#### common

mode 为`app`或`lib`都会有的选项

| name       | type                                      | default                                                   | desc                                                                                                                                                            |
| ---------- | ----------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| port       | number                                    | 8080                                                      | 开发模式下，webpack-dev-server 或 docz 服务器端口号                                                                                                             |
| assetsExt  | string[]                                  | ["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"] | 静态资源后缀                                                                                                                                                    |
| entry      | null \| function \| object \|string[]     | null                                                      | 配置入口文件，当没有配置时，app 模式下使用{plume}/index.jsx 作为默认入口；lib 模式下使用{src}/index.js 和{src}目录下每个`文件夹`内的 index.jsx 文件作为默认入口 |
| externals  | null \| String \| Array \| Object \| Regx | null                                                      | 配置外部依赖，当 app 模式时同 webpack 的 externals 配置，当 lib 模式时同 rollup 的 external                                                                     |
| cssMode    | string                                    | css                                                       | css 模式，影响打包时候对 css 的处理 可选值：css \| sass \| less \| styled-components                                                                            |
| cssModules | boolean                                   | false                                                     | 是否启用 cssModules，影响打包时对 css 的处理 可选值：true \| false                                                                                              |

#### entry: Function

当 entry 为 function 时，函数签名为：

`(plume_config:object) => null|object|string[]|string`

plume_config 为 plume 的配置选项

#### app

当 mode 为`app`时，options 内可以有的选项

| name       | type             | default                                                      | desc                                  |
| ---------- | ---------------- | ------------------------------------------------------------ | ------------------------------------- |
| target     | string           | root                                                         | 目标 element 的 ID                    |
| dll        | boolean          | true                                                         | 是否启用 dll 拆分                     |
| dllName    | string           | "vendor"                                                     | 拆分的 dll 文件名                     |
| dllVendor  | string[]         | ["react", "react-dom", "react-router-dom", "react-loadable"] | 拆分成 dll 的模块名称数组             |
| hashRouter | boolean          | false                                                        | 使用 hashRouter，默认为 browserRouter |
| flow       | boolean          | false                                                        | 是否使用 @plume/flow                  |
| webpack    | null \| function | null                                                         | 自定义 webpack 配置                   |
| gzip       | boolean          | true                                                         | 是否启用 gzip 压缩                    |

##### webpack

| name    | type             | default | signature                                                        | desc                                                                                 |
| ------- | ---------------- | ------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| webpack | null \| function | null    | null \| (webpack_config: object, plume_config: object) => object | 当 webpack 是函数的时候，接受当前的 webpack 配置和 plume 配置，输出新的 webpack 配置 |

参数：

- `webpack_config`: 为当前 webpack 的配置对象
- `plume_config`: plume 配置对象

返回：

- 返回新的 webpack 配置对象

#### lib

当 mode 为`lib`时，options 内可以有的选项

| name    | type             | default               | desc                      |
| ------- | ---------------- | --------------------- | ------------------------- |
| name    | string           | PlumeLib              | umd 打包时需要的 lib name |
| modules | string[]         | ["esm", "cjs", "umd"] | 打包的模式                |
| docDist | string           | doc                   | 输出文档的目录            |
| webpack | null \| function | null                  | 自定义 webpack 配置       |

##### webpack

| name    | type             | default | signature                                                        | desc                                                                                 |
| ------- | ---------------- | ------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| webpack | null \| function | null    | null \| (webpack_config: object, plume_config: object) => object | 当 webpack 是函数的时候，接受当前的 webpack 配置和 plume 配置，输出新的 webpack 配置 |

参数：

- `webpack_config`: 为当前 webpack 的配置对象
- `plume_config`: plume 配置对象

返回：

- 返回新的 webpack 配置对象
