# `plume`

> TODO: description

## Usage

```
const plume = require('plume');

// TODO: DEMONSTRATE API
```

## APIs

`plume init [--config <config_path>]`: 初始化.plume 文件

`plume dev [--config <config_path>]`: 开发模式

- 获取配置信息
- 在项目根目录建立.plume 文件夹
- 根据配置，新建 index.jsx 入口文件
- 根据配置，新建 pages.info.json 文件储存 pages 的目录结构
- 根据配置，新建 models.js 文件，输出所有 model
- 根据配置，新建 App.jsx 主应用文件
- 根据配置，新建.babelrc 文件。如果 root 目录下有，则使用 root 目录下的

`plume build [--config <config_path>]`: 打包

`plume test`: 测试

`plume analyze`: 分析 bundle 包

`plume < -h | --help >`: 查看帮助

## configs

plume 使用 `plume.config.js`文件来配置项目的功能

请将此文件置于项目根目录下

```js
{
  paths: {
    root, // 项目根目录 默认：process.cwd
    src, // 开发目录 默认：root/src
    pages, // 页面目录 默认： root/src/pages
    plume, // plume配置和入口目录 root/.plume
    output, // 输出目录 默认： root/dist
  },
  options: {
    target, // 目标element的ID 默认：root
    flow, // 是否使用 @plume/flow 默认：false
    gzip, // 是否启用gzip压缩 默认：true
    port, // 开发模式下，webpack-dev-server服务器端口号 默认：8080
    dll, // 是否启用dll拆分 默认：true
    dllName, // 拆分的dll文件名 默认 vendor
    dllVendor, // 拆分成dll的模块名称数组 默认： ["react", "react-dom", "react-router-dom", "react-redux", "redux"]
  }
}
```
