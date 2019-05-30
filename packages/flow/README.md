# `@plume/flow`

## TODOS

## Usage

```
model
  |- namespace
  |- state
  |- reducers
  |- effects

action
  |- isEffect
  |- type
  |- payload

reducer
  |- preState
  |- payload

effect
  |- actions
  |- payload
  |- getState

```

- actions -> 包含所有 action 动作（有副作用、无副作用）
- effects -> 包含所有副作用的动作的处理

1. 注册所有 model 到 this.\_models
2. 生成所有的 action 到 actions 对象
3. 生成所有的 effect 函数到 effects 对象，实现 action.type 对应 effect
4. 生成无副作用的 reducer 到 redux，实现 action.type 对应 reducer
5. 生成 asyncMiddleware
6. 生成 store
7. 注册 ReactDOM.render

# INSTALL

```bash
yarn add -D @plume/flow

# or
npm i -D @plume/flow
```

# USE

## 最小实现代码

```jsx
import Flow from "@plume/flow";

const app = new Flow();
app.run();
```

默认会生成一个页面，显示`Hello Flow!`

## 入口模块

`entry`属性表示程序的入口，默认为`<div>Hello Flow!</div>`

```jsx
import React from "react";
import Flow from "@plume/flow";

const Main = () => <div>Main module.</div>;
const app = new Flow({
  entry: <Main />,
});

app.run();
```

## 模型（model）

Flow 通过模型来定义某一类业务场景的动作和状态

```jsx
// 模型A modelA.js
export default {
  namespace: "compute",
  state: 0,
  reducer: {
    plus: state => state + 1,
    minus: state => state - 1,
  },
  effect: {
    asyncPlus: async (_payload, actions) => {
      setTimeout(() => actions.compute.plus(), 500);
    },
    asyncMinus: async (_payload, actions) => {
      setTimeout(() => actions.compute.minus(), 500);
    },
  },
};
```

在初始化的时候，配置`models`属性来注册定义的模型，`models`属性只能传递数组对象

```jsx
// index.jsx
import Flow from "@plume/flow";
import modelA from "./modelA.js";

const app = new Flow({
  models: [modelA],
});

app.run();
```

`namespace`属性定义了模型的命名空间，**故必须是唯一的**

`state`属性为模型的状态，可以是`number/object/string/array/boolean`，如果为空，则默认设置`0`

`reducer`属性定义了`无副作用`的动作

`effect`属性定义了`有副作用`的动作，**且必须为 async 函数**

## 容器组件（container component）

Flow 的`state`和`actions`需要通过容器组件来传递，通过导入`createContainer`方法来生成一个容器组件

```jsx
// 包装组件A
import React, { Component } from "react";
import { createContainer } from "@plume/flow";

class A extends Component {
  render() {
    const { state, actions } = this.props;
    const { plus, minus } = actions;
    return (
      <div>
        <div>{state}</div>
        <button onClick={() => plus()}>plus</button>
        <button onClick={() => minus()}>minus</button>
      </div>
    );
  }
}

return createContainer(A, {
  namespace: "compute",
});
```

`createContainer`方法做了两件事情：

1. 把 A 组件绑定到`compute`模型上
2. 把 compute 模型上的`state`和`actions`传递给 this.props

其中，`state`表示当前模型上的状态，`actions`表示当前模型上可以触发的动作

# APIs

## Flow

### signature

new Flow([options])

| name | type        | default | desc                        |
| ---- | ----------- | ------- | --------------------------- |
| Flow | constructor | -       | 构造函数，通过`new`创建实例 |

### options

| name        | optional | type         | default                  | desc                     |
| ----------- | -------- | ------------ | ------------------------ | ------------------------ |
| root        | true     | String       | "root"                   | 目标 html 节点的 id 属性 |
| entry       | true     | ReactElement | <div> Hello Flow! </div> | 入口组件                 |
| models      | true     | Array        | [DEFALUT_MODEL]          | 模型的数组               |
| middlewares | true     | Array        | []                       | redux 中间件的数组       |

**\*DEFALUT_MODEL**:

```js
{
  namespace: "*DEFAULT_MODEL*",
  state: 0,
  reducer: {
    plus: state => state + 1,
  },
}
```

### instanced

`flow.run()`: 开始运行

## createContainer

### signature

createContainer(\<ReactElement\>, [options]): ReactElement

### Options

| name       | optional | type     | defalut | desc                                                                                                                                |
| ---------- | -------- | -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| namespace  | true     | String   | null    | 模型的命名空间，如果为空，则`state`或`actions`为所有模型的`state`或`actions`的对象。如果有，则只包含此命名空间下的`state`或`action` |
| state      | true     | Function | null    | state 过滤方法，返回过滤后的 state                                                                                                  |
| actions    | true     | Function | null    | actions 过滤方法，返回过滤后的 actions                                                                                              |
| mergeProps | true     | Function | null    | 同 react-redux 中 connect 函数的 mergeProps                                                                                         |
| options    | true     | Function | null    | 同 react-redux 中 connect 函数的 options                                                                                            |

### example

假设现在有两个模型`A`和`B`

```js
// model A
{
  namespace: "A",
	state: 0,
    reducer: {
      a_plus: state => state + 1,
      a_minus: state => state - 1
    }
}

// model B
{
  namespace: "B",
	state: 0,
    reducer: {
      b_plus: state => state + 1,
      b_minus: state => state - 1
    }
}
```

实现一个容器组件`C`

```jsx
import React, { Component } from "react";
import { createContainer } from "@plume/flow";

class C extends Component {
  render() {
    const { state, actions } = this.props;
    return <div>container component C.</div>;
  }
}

return createContainer(C);
```

如果没有加`namespace`属性，则：

```jsx
// State
state => {
  A: 0,
  B: 0,
}

// Actions
actions => {
  A: { a_plus, a_minus },
  B: { b_plus, b_minus }
}
```

如果`namespace = A`，则：

```js
// State
state => 0;

// Actions
actions => {
  a_plus, a_minus;
};
```

## Model

| name      | optional | type   | default                      | desc                            |
| --------- | -------- | ------ | ---------------------------- | ------------------------------- |
| namespace | true     | String | \*DEFAULT_MODEL\*            | 模型的命名空间，不能重复        |
| state     | true     | any    | 0                            | 初始状态                        |
| reducer   | true     | Object | { plus: state => state + 1 } | 无副作用动作                    |
| effect    | true     | Object | null                         | 有副作用动作，必须是 async 方法 |

### reducer

#### signature

(state, payload): state

- State: 当前的状态
- patload: 传入的数据

输出新的状态

### effect

#### signature

(payload, actions, getState): void

- payload: 传入的数据
- actions: 所有已注册的模型的动作
- getState: 获取当前的 state 状态
