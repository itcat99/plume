# `lib`

> TODO: description

## Usage

```
npm -g i lib

index.js --help

// TODO: DEMONSTRATE API
```
lib 模式下，在{src}/modules目录下的每个目录，将被当作组件/组件库的模块，分别打包到单独的文件中。

例如，有lib的目录结构如下：

```
// lib: HELLOWORLD
|- src
  |- modules
    |- A
      |- index.js
  |- index.js
```

则在项目中可以这样引用：

```js
import HELLOWORLD, { A } from 'HELLOWORLD';
```