# Wrapper/包裹组件

包裹组件是在`{src}`目录下名为`_Wrapper.jsx`的文件。

包裹组件将会替换`{plume}/App.jsx`作为`入口模块`的`App`组件。

如果需要使用`{plume}/App.jsx`，可以在包裹组件内引用。

如果同时配置了`options.entry`和 wrapper 组件，请在入口模块内手动引用 wrapper 组件。

一个包裹组件的例子：

```jsx
import React, { Component } from "react";
import App from "../.plume/App.jsx";

class Main extends Component {
  render() {
    return (
      <div>
        <h1>Wrapper Component</h1>
        <App />
      </div>
    );
  }
}

export default Main;
```
