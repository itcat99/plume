# Flow 是什么

flow 脱胎于`redux`和`react-redux`，参考了[mirror](https://github.com/mirrorjs/mirror)库，是一个 react 的数据流处理方案。

它简化了 redux 复杂的 action --> reducer --> store 结构，直接使用`action` --> `store`， 同时又保留了 redux 的核心概念和生态系统。使开发更加轻松愉悦。

它还采用了 ES6 的`async/await`技术来处理异步 action，相比`redux-saga`的`Generator`函数，虽然没有集成那么多强大的功能，但是学习曲线平缓了许多，更适合初学者使用。并且通过`async/await`也可以做到`redux-saga`同样的功能。

## 前置基础

首先需要了解以下知识点：

- Javascript 基础
- React 基础
- 前端工程化基础

可以更好的帮助你了解 Flow
