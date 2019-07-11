# Common config

## mode

项目的模式，`app`|`lib`二选一，影响打包和开发。默认为`app`。

## paths

| name   | type   | default       | desc         |
| ------ | ------ | ------------- | ------------ |
| root   | string | process.cwd() | 项目根目录   |
| src    | string | {root}/src    | 开发目录     |
| output | string | {root}/dist   | 打包输出目录 |
| assets | string | {dist}/assets | 静态资源目录 |

## options

mode 为`app`或`lib`都会有的选项

| name       | type                                  | default                                                   | desc                                                                                                                                                            |
| ---------- | ------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| port       | number                                | 8080                                                      | 开发模式下，webpack-dev-server 或 docz 服务器端口号                                                                                                             |
| assetsExt  | string[]                              | ["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"] | 静态资源后缀                                                                                                                                                    |
| entry      | null \| function \| object \|string[] | null                                                      | 配置入口文件，当没有配置时，app 模式下使用{plume}/index.jsx 作为默认入口；lib 模式下使用{src}/index.js 和{src}目录下每个`文件夹`内的 index.jsx 文件作为默认入口 |
| cssMode    | string                                | css                                                       | css 模式，影响打包时候对 css 的处理 可选值：css \| sass \| less \| styled-components                                                                            |
| cssModules | boolean                               | false                                                     | 是否启用 cssModules，影响打包时对 css 的处理 可选值：true \| false                                                                                              |

### entry: Function

当 entry 为 function 时，函数签名为：

`(plume_config:object) => null|object|string[]|string`

plume_config 为 plume 的配置选项
