可以手动指定项目入口文件，在`plume.config.js`内配置`options.entry`选项，指定入口文件的位置。

当手动指定 entry 时:

- 需要手动引入`{plume}/App.jsx`文件
- 需要手动引入 React,ReactDOM
- 需要手动渲染 App
- 需要手动指定渲染的目标元素

```jsx
import App from ".plume/App.jsx";
import ReactDOM from "react-dom";

ReactDOM.render(<App />, document.getElementById("root"));
```

打包时，为每一个页面单独打包需要的资源文件。
