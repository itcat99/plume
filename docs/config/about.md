# config

plume 的配置文件，由[通用配置](/config/common)和不同`plume模块`的配置文件共同构成。

创建一个配置文件十分简单，只需要在项目根目录下新建`plume.config.js`文件，并使用`module.export`输出一个配置文件对象即可。

配置文件对象包含三部分：

- mode
- paths
- options

当使用`plume-cli`构建的时候，会默认在项目根目录创建一个配置文件。

### mode

项目的模式，影响打包和开发。目前 plume 可以使用两个开发模式`app`和`lib`，分别对应 web 应用和 lib 库。默认为`app`。

### paths

paths 包含了项目内特殊目录映射的`绝对路径`，根据`mode`的不同，paths 包含的内容也不尽相同。

### options

options 包含了影响项目开发、构建等的配置信息，根据`mode`的不同，分别又不同的选项。
