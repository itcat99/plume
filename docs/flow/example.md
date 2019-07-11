# 一个使用 flow 的例子

页面上有四个按钮，分别触发`加1`、`减1`、`延迟500ms加1`、`延迟500ms减1`的动作，另外有一个`view`来显示当前的数字。

## 设计 model

```js
export default {
  namespace: "component", // model的命名空间，是唯一的
  state: 0, // 储存的初始状态为0
  reducer: {
    plus: state => state + 1,
    minus: state => state - 1,
  },
  effect: {
    asyncPlus: async (payload, actions) => {
      await wait(500); // 假设这是一个延迟函数
      actions.component.plus();
    },
    asyncMinus: async (payload, actions) => {
      await wait(500); // 假设这是一个延迟函数
      actions.component.minus();
    },
  },
};
```

## 连接 model 和组件

```jsx
// App.jsx
import React, { Component } from "react";
import { createContainer } from "@plume/flow";

class Example extends Component {
  render() {
    const { actions, state } = this.props;
    const { plus, minus, asyncPlus, asyncMinus } = actions;

    return (
      <div>
        {state}
        <button onClick={plus}>plus</button>
        <button onClick={minus}>minus</button>
        <button onClick={AsyncPlus}>AsyncPlus</button>
        <button onClick={AsyncMinus}>AsyncMinus</button>
      </div>
    );
  }
}

// 使用createContainer创建一个容器组件
export default createContainer(Example, {
  namespace: "compute", // 连接到名为compute的model
});
```

## 运行 Flow

```jsx
import React from "react";
import Flow from "@plume/flow";
import App from "App.jsx";

import compute from "models/compute.js";

const flow = new Flow({
  root: "root",
  entry: <App />,
  models: [compute],
});

flow.run();
```
