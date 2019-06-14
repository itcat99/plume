# `core`

> core module

核心模块类，包含了核心事务`initial`，`dependents`，`dev`，`build`，cli 任务注册入口`registerCli`以及公用配置`common config`。

子模块应当继承此类，并复写核心事务，添加相应的配置清单。

## Properties

### config

是通用的默认配置选项，不同的 mode 模块，需要根据此配置项扩展

| name    | type   | desc                                                           |
| ------- | ------ | -------------------------------------------------------------- |
| mode    | string | 项目模式，根据不同的 mode 库，由`@plume/cli`自动添加，不可编辑 |
| paths   | object | 各种目录的配置对象                                             |
| options | object | 通用的配置选项                                                 |

#### paths

| name   | type   | default       | desc                             |
| ------ | ------ | ------------- | -------------------------------- |
| root   | string | process.cwd() | 项目根目录，默认为创建的项目目录 |
| src    | string | {root}/src    | 开发目录                         |
| output | string | {root}/dist   | 打包输出目录                     |
| assets | string | {dist}/assets | 静态资源目录                     |

#### options

| name             | type    | default | desc                                                                    |
| ---------------- | ------- | ------- | ----------------------------------------------------------------------- |
| port             | number  | 8080    | 开发服务器端口号                                                        |
| cssMode          | string  | css     | css 模式，影响打包时候对 css 的处理 可选值：css \| sass \| less \| none |
| styledComponents | boolean | false   | 是否启用 styled-components                                              |
| cssModules       | boolean | false   | 是否启用 cssModules，影响打包时对 css 的处理 可选值：true \| false      |

## Methods

### initial

方法签名：`cli_config: Object => void`

cli_config 为 cli 传入的配置项

功能：此方法需要处理新建项目的目录构建、配置文件构建等项目初始化构建的工作。

备注：

- 默认处理的工作：[`创建项目目录`，`创建 package.json 文件`，`初始化 git`，`初始化 gitignore`，`初始化 plume.config.js 文件`]
- 附加处理的工作：如果选择了`eslint`，还将运行[`初始化 eslint`]

### dependents

方法签名：`cli_config: Object => {dev: string[], prod:string[]}`

功能：返回一个包含了项目所有依赖的名称的对象。在构建项目时，会被自动安装。

| name | type     | desc     |
| ---- | -------- | -------- |
| dev  | string[] | 开发依赖 |
| prod | string[] | 生产依赖 |

备注：

- 默认不返回任何值
- 如果选择不自动安装依赖，当项目创建完毕后，会提示安装依赖项。

### dev

方法签名：`plume_config: object => void`

plume_config 为 plume 的配置文件对象，当使用 cli 工具执行`plume-cli dev`时，会查找当前项目目录下的 plume.config.js 文件，并生成配置文件对象

功能：执行项目开发时的一些操作，例如配置 webpack、启动开发服务器等。

备注：

- 默认为空方法

### build

方法签名：`plume_config: object => void`

plume_config 为 plume 的配置文件对象，当使用 cli 工具执行`plume-cli build`时，会查找当前项目目录下的 plume.config.js 文件，并生成配置文件对象

功能：执行项目打包构建时的一些操作，例如配置 webpack、打包输出等。

备注：

- 默认为空方法

### registerCli

方法签名：`program => void`

program 是`Commander`的实例，具体可以参考[Commander.js 官方教程](https://github.com/tj/commander.js)

功能： 处理要注册的 command

备注：

- 默认为空方法

### getConfig

方法签名：`(config_path: string, cwd: string) => plume_config`

config_path 为手动指定的 config 配置文件地址，可以是绝对路径或相对路径。如果是相对路径，则相对于 cwd 指定的目录搜索

cwd 为当前目录地址，默认为 process.cwd()返回的路径。在此目录下搜索`plume.config.js`文件

功能：获取当前的`plume_config`配置
