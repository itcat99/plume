## add

命令：`plume-cli add <NAME> [PATH] [MODE]`

说明：新建组件。`<NAME>`为组件的名称，`[PATH]`为新建组件的目标地址，默认存放在不同组件的`{paths}`地址内。`[MODE]`为新建组件的类型。

### MODE

| name | desc                                                                                                                                      |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| /    | 不填写 MODE 时候，默认新建`component`组件                                                                                                 |
| -C   | 新建`Container`组件。有关 Container 组件的详细信息，请查看[@plume/flow - 连接 model 与 component](/flow/model?id=连接-model-与-component) |
| -M   | 新建`Model`组件。有关 Model 组件的详细信息，请查看 [@plume/flow - Model](/flow/model) **新建 Model 组件时，必须指定[PATH]**               |
| -P   | 新建`Page`页面组件                                                                                                                        |
