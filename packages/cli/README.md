# `@plume/cli`

> TODO: description

## Usage

```
npm -g i @plume/cli

cli --help

// TODO: DEMONSTRATE API
```

`plume-cli create <PROJECT_NAME> [PATH] [-l] [-s]`：创建新项目，默认在当前目录下。\[PATH\] 选项指定创建目录。默认创建`app`类型的项目，`-l`创建`library`类型的项目。`-s`跳过安装依赖的步骤，后续手动安装。

`plume-cli create <-h | --help>`：查看 create 命令的帮助

`plume-cli init [CONFIG_PATH]`: 初始化 plume 项目 \[CONFIG_PATH\] 自定义 config 文件路径

`plume-cli dev [CONFIG_PATH]`: 运行开发模式 \[CONFIG_PATH\] 自定义 config 文件路径

`plume-cli build [CONFIG_PATH]`: 打包项目 \[CONFIG_PATH\] 自定义 config 文件路径

`plume-cli add <NAME> [PATH] [-c | -m | -p]`：添加新组件(component)，默认在`@plume/core`的 config 指定的目录下新建。\[PATH\] 选项指定创建目录。`-c`修改创建目标为`container`组件。`-m`修改创建目标为`model`组件。`-p`修改创建目标为`page`页面。

**⚠️ 注意：** 当添加`model`组件时，必须指定目标\[PATH\]

`plume-cli add <-h | --help>`：查看 add 命令的帮助

`plume-cli upgrade [-f | -a]`：更新`@plume/core`。`-f`更新`@plume/flow`。 `-a` 更新`@plume/core`和`@plume/flow`。

`plume-cli upgrade <-h | --help>`：查看 update 命令的帮助

`plume-cli update`：更新`@plume/cli`

`plume-cli help`：查看帮助

## Create

选项：

- `@plume/flow`: 是否启用@plume/flow 数据流管理
- `eslint`: 是否启用 eslint 检测及 prettier 美化
- `scss`: 是否支持 scss **需要 node-sass**
- `less`: 是否支持 less
