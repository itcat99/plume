# Layout 布局

当你希望一些页面具有相同的布局或模板的时候，可以使用 Layout 布局。

使用 Layout 布局的页面外层将会包裹 Layout 组件，原始的页面作为 Layout 组件的`this.props.children`，可以在 Layout 组件内手动调用。

Layout 会影响生成的路由配置文件，存在 Layout 的页面，会加入`layout`字段，值为 layout 组件相对`{pages}`目录的位置。

一个 Layout 布局的例子：

```jsx
import React, { Component } from "react";

class Layout extends Component {
  render() {
    return (
      <div>
        This is Layout Component.
        {
          // this.props.children 就是被Layout包裹的原始页面
          this.props.children
        }
      </div>
    );
  }
}

export default Layout;
```

## 全局 Layout

在`{pages}`根目录添加`_Layout.jsx|.js`组件，则会产生全局 Layout，所有页面的外层都会包裹这个 Layout 组件。

例如如下目录结构：

```
└── pages
    ├── _Layout.jsx
    ├── About
    │   └── index.jsx
    ├── Home
    │   └── index.jsx
    ├── Post
    │   └── index.jsx
    └── Other.jsx
```

则会生成以下路由配置：

```json
[
  {
    "path": "/",
    "children": [
      {
        "path": "/About",
        "component": "/About/index.jsx"
      },
      {
        "path": "/",
        "component": "/Home/index.jsx"
      },
      {
        "path": "/Post",
        "component": "/Post/index.jsx"
      }
    ],
    "layout": "/_Layout.jsx"
  }
]
```

## 局部 Layout

在`{pages}`下的目录内，创建`_Layout.jsx|js`组件，则会产生局部 Layout，所有此目录下的页面，会以这个 Layout 组件作为 Layout。

例如如下目录结构：

```
└── pages
    ├── About
    │   └── index.jsx
    ├── Home
    │   └── index.jsx
    ├── Post
    │   ├── _Layout.jsx
    │   └── index.jsx
    └── Other.jsx
```

则会生成以下路由配置：

```json
[
  {
    "path": "/About",
    "component": "/About/index.jsx"
  },
  {
    "path": "/Post",
    "component": "/Post/index.jsx",
    "layout": "/Post/_Layout.jsx"
  },
  {
    "path": "/",
    "component": "/Home/index.jsx"
  }
]
```

## 嵌套的 Layout

Layout 采用`就近原则`，当有多个嵌套的 Layout 时，页面选择最近的渲染。

例如如下目录结构：

```
└── pages
    ├── About
    │   └── index.jsx
    ├── Home
    │   └── index.jsx
    ├── Post
    │   ├── _Layout.jsx
    │   └── index.jsx
    └── _Layout.jsx
```

则会生成一下路由配置：

```json
[
  {
    "path": "/Post",
    "component": "/Post/index.jsx",
    "layout": "/Post/_Layout.jsx"
  },
  {
    "path": "/",
    "children": [
      {
        "path": "/About",
        "component": "/About/index.jsx"
      },
      {
        "path": "/",
        "component": "/Home/index.jsx"
      }
    ],
    "layout": "/_Layout.jsx"
  }
]
```

我们看到，由于`Post`目录下有`_Layout.jsx`，所以生成的路由文件，Post 下`layout`属性的值为`/Post/_Layout.jsx`，也就是 post 目录下的那个 Layout 组件的相对位置。
