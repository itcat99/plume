# `lib`

> TODO: description

## Usage

```
npm -g i lib

index.js --help

// TODO: DEMONSTRATE API
```
lib 模式下，在{src}/components目录下的每个目录，将被当作组件/组件库的模块，分别打包到单独的文件中。

例如，有lib的目录结构如下：

```
// lib: HELLOWORLD
|- src
  |- components
    |- A
      |- index.js
  |- index.js
```

则在项目中可以这样引用：

```js
import { A } from 'HELLOWORLD';
```

lib 模式下，在{src}/modules目录下的每个目录，作为组件整体的模块，打包到整体组件中。

例如：开发一个单一组件（不是组件库）A，需要用到B，C组件模块，则目录为

```
// component A
|- src
  |- modules
    |- B
      |- index.jsx
    |- C
      |- index.jsx
  |- index.jsx
```

打包为一个js文件，包含B、C模块

因此，

- 如果想要开发组件库或带有子组件的单一组件，则使用`components`目录
- 如果想要开发不带子组件的单一组件，则内部模块使用`modules`目录
