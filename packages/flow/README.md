# `@plume/core`

> TODO: description

## Usage

```
const core = require('@plume/core');

// TODO: DEMONSTRATE API
```

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
  |- payload
  |- actions
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
