# APIs

## Flow

### 签名

**new Flow(`[options]`)**

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

## run

run 是 flow 的实例方法，`flow.run()`可以启动 flow

## createContainer

### 签名

**createContainer(\<ReactElement\>, `[options]`): ReactElement**

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
