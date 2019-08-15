plume 使用`file-loader`来管理静态资源，默认输出文件夹`{output}/assets`，默认识别后缀为["jpg", "gif", "png", "ttf", "woff", "eot", "svg", "otf"]的静态资源。

可以在`plume.config.js`的 options 选项内修改默认文件类型，详情查看[通用配置文件](config/common?id=options)的`assetsExt`字段。

使用静态资源：

```jsx
import React from "react";
import icon from "../icon.png";

export default () => {
  return (
    <div>
      Home
      <img src={icon} alt="icon" />
    </div>
  );
};
```

在开发时，如果有需要引入静态资源，默认需存放在`{src}/assets`目录。

当打包时，将会把 assets 目录下的所有资源（除了配置`options.assetsIgnore`选项内的）拷贝到`{output}/assets`目录下。

**注意 ⚠️**：如果在资源中有引入`.html`文件，而 html 文件又引入其他静态资源，如`<script src="main.js" />`，则不能使用`import`的形式引入，需要直接写「**输出目录到`.html`文件的相对路径**」。

类似这样的资源，都需要如此引入。

例如，有如下结构：

```
├── assets
│   ├── index.html
│   └── scripts
│       └── main.js
└── pages
    └── Home
        └── index.jsx
```

其中`Home/index.jsx`引入了`index.html`文件，html 文件内引入了`main.js`

```html
<html>
  <head>
    <title>Html file</title>
  </head>
  <body>
    <script src="scripts/main.js" />
  </body>
</html>
```

在`Home/index.jsx`中引入 html：

```jsx
import html from "_assets/index.html"; // ❌错误

class Home extends React.Component {
  render() {
    return (
      <div>
        <iframe src={html} /> ❌错误
        <iframe src="/assets/index.html" /> ✅正确
      </div>
    );
  }
}
```
