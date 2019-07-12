@plume/app 可以配合@plume/flow 来管理应用的数据流。

1. 创建 models 的时候，会搜索当前项目下所有`models`目录，目录内的每个`*.js`文件作为一个 model，所以 models 目录下每个 js 文件务必有默认输出 `export defaut`。支持嵌套 models 目录。默认忽略`node_modules`和`.plume`目录。
2. 每个 model 的`namespace`必须是**唯一**的

若使用其他数据流工具，如`redux-saga`，可以使用`包裹组件`或者自定义`entry`入口文件。

使用 saga 的例子：

```jsx
// Entry入口文件
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
