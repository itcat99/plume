# `lib`

## TODOS

- [ ] 静态资源引用
- [ ] 压缩

## Usage

```
yarn add @plume/lib -D
```

### js

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
  	|- assets
  		|- a.jpg
  		|- xx.svg
  	|- style.css
    |- index.js
```

### css

- 支持`sass|less|css`
- 支持`cssModules|styled-components`

对于`cjs|esm`，会把转义的 css 文件放在对应的目录内
对于`umd`，会把 css 文件打包成`style.css`放在 umd 的输出目录内
对于`styled-components`不会提取 css，会内置在相应的 js 文件内

### assets

assets 配置项在 config/options/assetsExt，相关后缀的文件将被当作静态资源
打包规则与 css 相似，不同的是，对于`umd`，会放在配置的{assets}目录下
