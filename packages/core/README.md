# `@plume/core`

> TODO: description

**@plume/core 的功能发生重大变更，现在仅作为@plume/app 和@plume/lib 的依赖**

new PlumeCore 的实例含有两个函数`dev`和`build`作为开发模式和打包使用

dev 和 build 均返回一个 Promise 函数，可以在 then 和 catch 内进行生成 webpack 实例的后续操作
