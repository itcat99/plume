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
