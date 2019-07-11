# 通用 cli

## create

命令：`plume-cli create <NAME> [PATH]`

说明：创建项目，`<NAME>`是项目的名称，`[PATH]`为项目的目标地址，默认为当前目录下

## dev

命令：`plume-cli dev [CONFIG]`

说明：启用开发服务器，`[CONFIG]`为自定义 plume 配置文件，默认为项目目录下的`plume.config.js`文件。有关 plume 的配置文件的详细信息，请参考[plume 配置文件](/config/about)

## build

命令：`plume-cli build [CONFIG]`

说明：打包项目，`[CONFIG]`为自定义 plume 配置文件，默认为项目目录下的`plume.config.js`文件。有关 plume 的配置文件的详细信息，请参考[plume 配置文件](/config/about)

## version | -v

命令：`plume-cli --version | -v`

说明：查看 cli 版本号

## help | -h

命令：`plume --help | -h`

说明：查看 cli 帮助
