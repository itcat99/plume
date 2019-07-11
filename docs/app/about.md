# @plume/app

使用简单的方式构建 react+react-router+webpack 的 web 应用

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

打包时，为每一个页面单独打包需要的资源文件。

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
- [x] 支持权限路由
- [x] 支持动态路由
- [x] 支持可选动态路由
- [x] 支持静态资源打包
- [x] 集成 axios
