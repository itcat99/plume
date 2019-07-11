# 权限组件

当需要对某些页面做权限控制的时候，可以使用权限组件。

使用权限组件的页面，当路由导航到此处时，会先加载权限组件，验证权限，通过时加载此页面。如果权限验证失败，则进行其他操作。

权限组件会影响生成的路由配置文件，存在权限组件的页面，会加入`author`字段，值为 权限组件相对`{pages}`目录的位置。

权限组件和[Layout 布局](/app/layout)使用方式类似，不同的地方在于，当同时存在`Layout布局`和`权限组件`时， 权限组件将包裹在 Layout 布局外层，即：**先验证权限，再加载 Layout**。

一个权限组件的例子：

```jsx
import React, { Component } from "react";
import { Redirect } from "react-router-dom";

class Author extends Component {
  render() {
    const Cmp = this.props.children; // 这个是要渲染的页面

    // 此处判断权限
    if (isLogin) {
      return <Cmp />; // 加载组件
    } else {
      return <Redirect to="/login" />; // 重定向
    }
  }
}

export default Author;
```

## 全局权限

在`{pages}`根目录创建`_Author.jsx|js`组件，会生成全局权限，所有页面都会通过此组件验证。

## 局部权限

在`{pages}`下的目录内，创建`_Author.jsx|js`组件，则会产生局部权限，所有路由到此目录下的页面，会通过这个权限组件来验证是否加载。

## 嵌套的权限验证

权限组件采用`就近原则`，当有多个嵌套的权限组件时，页面选择最近的做权限验证。
