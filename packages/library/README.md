# `lib`

> TODO: description

## Usage

```
yarn add @plume/lib -D
```

lib 模式下，会把{src}目录下的文件、文件夹转化输出到 lib 目录的不同打包方式(cjs | esm | umd)目录下

例如，有 lib 的目录结构如下：

```
// lib: HELLOWORLD
|- src
  |- components
    |- A
      |- index.jsx
  |- index.js
```

输出为：

```
|- lib
  |- cjs
    |- A
      |- index.js
    |- index.js
  |- esm
    |- A
      |- index.js
    |- index.js
  |- umd
    |- index.js
```
