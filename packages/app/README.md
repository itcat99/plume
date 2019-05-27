# `app`

> TODO: description

## entry

plume 可以手动指定项目入口文件，在`plume.config.js`内配置`options.entry`选项，指定入口文件的位置。

当手动指定 entry 时:

- 需要手动引入`{plume}/App.jsx`文件
- 需要手动引入 React,ReactDOM
- 需要手动渲染 App
- 需要手动指定渲染的目标元素

```jsx
import App from ".plume/App.jsx";
import ReactDOM from "react-dom";

ReactDOM.render(<App />, document.getElementById("root"));
```

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
├── .babelrc
├── .gitignore
├── .plume
│   ├── 404.jsx
│   ├── App.jsx
│   ├── Router.jsx
│   ├── index.jsx
│   └── pagesInfo.json
├── package.json
├── plume.config.js
├── src
│   ├── components
│   └── pages
│       ├── About
│       │   └── index.jsx
│       ├── Home
│       │   └── index.jsx
│       └── Product
│           ├── Product_1
│           │   └── index.jsx
│           └── index.jsx
└── yarn.lock
```

则会自动创建如下 router

```bash
/ # Home
/about # About
/product # Product
/product/product_1 # Product/Product_1
```

打包时，为每一个页面单独打包需要的资源文件。

### dynamic router

在文件或目录名称前加上`$`表示动态路由

例如：

```
├ pages
   └── Dynamic
     ├── $id.jsx
     └── index.jsx

```

则会生成

```
/dynamic
/dynamic/:id
```

这样的动态路由

## 嵌套路由

在`{pages}`下的每个目录或`js|jsx`文件（除了 index 文件）会被当作一个页面，所以可以在页面目录下嵌套其他目录，实现路由嵌套

例如：

```
{pages}
  ├─ Post
    ├─ P1
    ├─ P2
```

则会生成:

```json
[
  {
    "path": "/Post",
    "component": "{pages}/Post/index.jsx"
  },
  {
    "path": "/Post/P1",
    "component": "{pages}/Post/P1/index.jsx"
  },
  {
    "path": "/Post/P2",
    "component": "{pages}/Post/P2/index.jsx"
  }
]
```

的结构，访问不同的地址，则会跳转到相应页面

## @plume/flow && models

1. 创建 models 的时候，会搜索当前项目下所有`models`目录，目录内的每个`*.js`文件作为一个 model，所以 models 目录下每个 js 文件务必有默认输出 `export defaut`。支持嵌套 models 目录。默认忽略`node_modules`和`.plume`目录。
2. 每个 model 的`namespace`必须是**唯一**的

可以使用其他数据流工具，如`redux-saga`，必须使用自定义的`entry`入口文件。

使用 saga 的例子：

```jsx
import App from ".plume/App.jsx";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { helloSaga } from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(helloSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
```

## 404 页面

有默认的 404 页面，也可以自定义

自定义的 404 页面放置在`{pages}/404`目录下，当检测到`{pages}/404`目录存在时，将使用自定义的 404 页面

## 静态资源

使用了`file-loader`来管理静态资源，默认输出文件夹`{output}/assets`，默认识别后缀为["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"]的静态资源。

使用静态资源：

```jsx
import React from "react";
import icon from "../icon.png";

export default () => {
  return (
    <div>
      Home
      <img src={icon} alt="icon" />
    </div>
  );
};
```

## 网络请求

集成了[\[axios\]](https://github.com/axios/axios)库

使用方法：

```js
import { axios } from "@plume/core";

axios
  .get("/")
  .then(result => {})
  .catch(reault => {});
```

## TODOS

- [x] 支持 dev 下，当新建 page 页面时，更新 pageInfo.json 文件
- [x] 支持 dev&&flow 下，当新建 model 时，更新 models.js 文件
- [x] 支持多层路由
- [x] 支持嵌套路由
- [ ] 支持权限路由
- [x] 支持动态路由
- [x] 支持可选动态路由
- [x] 支持静态资源打包
- [x] 集成 axios
