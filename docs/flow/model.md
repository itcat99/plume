# model/模型

模型是对某一类具体事务的抽象描述。

比如登陆注销这一套具体事务，可以抽象成几个动作：`login`、`logout`，并且管理了用户是否登陆（isLogin）这一状态。

这个 model 就可以写成：

```js
export default {
  namespace: "login",
  state: {
    isLogin: false,
  },
  reducer: {
    update: payload => {
      isLogin: payload;
    },
  },
  effect: {
    login: async (payload, actions) => {
      const isLogin = await axios.put("/login", payload);
      actions.login.update(isLogin);
    },
    logout: async (payload, actions) => {
      await axios.put("/logout");
      actions.login.update(false);
    },
  },
};
```

model 返回一个普通的对象，对象内包含：`namespace`、`state`、`reducer`、`effect`。

| name      | type   | default                      | desc                            |
| --------- | ------ | ---------------------------- | ------------------------------- |
| namespace | String | \*DEFAULT_MODEL\*            | 模型的命名空间，不能重复        |
| state     | any    | 0                            | 初始状态                        |
| reducer   | Object | { plus: state => state + 1 } | 无副作用动作                    |
| effect    | Object | null                         | 有副作用动作，必须是 async 方法 |

**_注意_**：model 内必须含有至少一个`动作(action)`

## namespace

model 的命名空间，可以把它当作 model 的`id`，在定义的所有 model 中，这个 namespace 是唯一的。

## state

当前 model 的状态，可以当作这个 model 的数据源。当新建一个 model 时，需要定义初始的 state。所有 model 的 state 组合构成`store`

## reducer

函数签名： **(state, payload): state**

reducer 是一个对象，对象内每个元素应该是一个`普通函数`，这个函数接收`state`和`payload`两个参数，state 代表当前的 state 状态，payload 代表触发 action 时传入的参数

## effect

函数签名：**async (payload, actions, getState): Promise**

effect 是一个对象，对象内每个元素应该是一个`async/await函数`，这个函数接收`payload`、`actions`、`getState`三个参数。

**payload** 代表触发 action 时传入的参数。

**actions** 是一个对象，包含`所有model`内定义的 actions，用 model 的 namespace 作为分隔。

例如某 model 的 namespace 是`abc`，则调用这个 model 的 action 的路径为`actions.abc.xxx`。

**getState** 是一个函数，返回当前的 state 状态。

## 连接 model 与 component

前面说过，model 是连接 component 和 store 的桥梁，那么怎么把它们连接起来呢。

很简单，使用`createContainer`创建 Container 组件，可以使 component 方便的拿到 model 内的 actions 和 state，从而得到改变 store 的能力。

以前面的 login model 为例：

```jsx
import React, { Component } from "react";
import { createContainer } from "@plume/flow";
import { Redirect } from "react-router-dom";

class Home extends Component {
  render() {
    const { actions, state } = this.props;
    const { isLogin } = state;

    return isLogin ? <div>Welecome!</div> : <Redirect to="/login" />;
  }
}

export default createContainer(Home, {
  namespace: "login",
});
```

createContainer 函数接收两个参数，第一个是需要连接的组件，第二个是选项。

选项内的`namespace`指定了连接的 model，这里的 namespace 需要和 model 内的 namespace 统一。

配置好了以后，目标组件的`props`内会多处两个元素。`actions`和`state`。

actions 对应当前 model 内的`reducer`和`effect`函数，state 对应当前 model 内的 state 属性。

此时就可以通过 action 操作 state 了！
