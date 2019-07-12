# App config

## paths

| name       | type   | default          | desc           |
| ---------- | ------ | ---------------- | -------------- |
| pages      | string | {src}/pages      | 页面目录       |
| plume      | string | {root}/.plume    | plume 目录     |
| components | string | {src}/components | 静态组件的目录 |
| containers | string | {src}/containers | 包装组件目录   |

## options

| name       | type                                      | default                                                      | desc                                                            |
| ---------- | ----------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| target     | string                                    | root                                                         | 目标 element 的 ID                                              |
| dll        | boolean                                   | true                                                         | 是否启用 dll 拆分                                               |
| dllName    | string                                    | "vendor"                                                     | 拆分的 dll 文件名                                               |
| dllVendor  | string[]                                  | ["react", "react-dom", "react-router-dom", "react-loadable"] | 拆分成 dll 的模块名称数组                                       |
| hashRouter | boolean                                   | false                                                        | 使用 hashRouter，默认为 browserRouter                           |
| flow       | boolean                                   | false                                                        | 是否使用 @plume/flow                                            |
| webpack    | null \| function                          | null                                                         | 自定义 webpack 配置                                             |
| gzip       | boolean                                   | true                                                         | 是否启用 gzip 压缩                                              |
| proxy      | null \| string\| object \| function       | null                                                         | 同 webpack-dev-server 的 proxy，使用 proxy 时，默认开启允许跨域 |
| analyzer   | boolean                                   | false                                                        | 打包完成后显示项目所有包的体积和内容，不包括 dllVendor          |
| externals  | null \| String \| Array \| Object \| Regx | null                                                         | 配置外部依赖，同 webpack 的 externals 配置                      |

### webpack

| name    | type             | default | signature                                                        | desc                                                                                 |
| ------- | ---------------- | ------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| webpack | null \| function | null    | null \| (webpack_config: object, plume_config: object) => object | 当 webpack 是函数的时候，接受当前的 webpack 配置和 plume 配置，输出新的 webpack 配置 |

自定义的 webpack 配置的优先级最高

参数：

- `webpack_config`: 为当前 webpack 的配置对象
- `plume_config`: plume 配置对象

返回：

- 返回新的 webpack 配置对象

### proxy

当使用 proxy 代理的时候，可以使用`string | object | function`的形式

使用`object | function`的规则遵循 webpack 的 devServer.proxy 的配置规则

使用`string`时，将自动配置为`{ "*": CUSTOM_HOST }`的 object 形式
