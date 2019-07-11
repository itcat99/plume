## 基础路由

- plume 根据`pages`目录下的文件夹划分页面，pages 目录下的每个目录或`.js|.jsx`文件作为一个页面，目录需要`index.jsx`作为页面入口。
- 子文件夹具有相同的规则
- 默认`Home`页为入口页，路由体现为`/`
- 其他页面的路由为其页面文件夹的名称的英文小写，例如`About`页面的路由为`/about`

例如如下目录结构：

```
└── pages
    ├── About
    │   └── index.jsx
    ├── Home
    │   └── index.jsx
    ├── Post
    │   ├── Post_1
    │   │   └── index.jsx
    │   └── index.jsx
    └── Other.jsx
```

则会生成以下路由配置：

```json
[
  {
    "path": "/Post/Post_1",
    "component": "/Post/Post_1/index.jsx"
  },
  {
    "path": "/About",
    "component": "/About/index.jsx"
  },
  {
    "path": "/Other",
    "component": "/Other.jsx"
  },
  {
    "path": "/Post",
    "component": "/Post/index.jsx"
  },
  {
    "path": "/",
    "component": "/Home/index.jsx"
  }
]
```

## 动态路由

- 在文件/目录名称**前**加上`$`美元符号，将其变为一个动态路由

例如如下目录结构：

```sh
└── pages
    ├── Home
    │   └── index.jsx
    └── Post
        ├── index.jsx
        └── $id.jsx
```

则生成如下路由配置：

```json
[
  {
    "path": "/Post/:id",
    "component": "/Post/$id.jsx"
  },
  {
    "path": "/Post",
    "component": "/Post/index.jsx"
  },
  {
    "path": "/",
    "component": "/Home/index.jsx"
  }
]
```

## 可选的动态路由

- 在文件/目录名称**后**加上`$`美元符号，将其变为一个可选的动态路由

例如如下目录结构：

```sh
└── pages
    ├── Home
    │   └── index.jsx
    └── Post
        ├── index.jsx
        └── id$.jsx
```

则生成如下路由配置：

```json
[
  {
    "path": "/Post/:id?",
    "component": "/Post/id$.jsx"
  },
  {
    "path": "/Post",
    "component": "/Post/index.jsx"
  },
  {
    "path": "/",
    "component": "/Home/index.jsx"
  }
]
```
