# plume 开发环境配置

## 安装 nvm

nvm 项目地址：[https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

windows 环境：[https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

### 修改`.zshrc`或`.bash_profile`或`.profile`

将以下内容复制粘贴到`~/.zshrc`,`~/.bash_profile`,`~/.profile`任意一个文件内，使用哪个文件取决于当前 shell 环境

```bash
# NVM config
export NVM_DIR="${XDG_CONFIG_HOME/:-$HOME/.}nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

查看当前 shell 环境

```bash
echo $SHELL
```

如果是`zsh`则添加到`~/.zshrc`，如果是`bash`则添加到`~/.bash_profile`或`~/.profile`

如果文件不存在，则新建

### 使生效

```bash
# source 后跟刚才添加的文件路径
source ~/.zshrc
```

## 安装 node

使用 nvm 可以管理 node 版本，基本使用方法

```bash
nvm install <NODE VERSION>
```

例如安装 12 版 node：

```bash
nvm install 12
```

或者使用当前稳定版本

```bash
nvm install stable
```

切换 node 版本（只针对当前打开的终端窗口有效）

```bash
nvm use <NODE VERSION>
```

切换默认的 node 版本

```bash
nvm alias default <NODE VERSION>
```

## 切换淘宝源

使用`nrm`来切换 npm 的源，安装 nrm：

nrm 项目地址：[https://github.com/Pana/nrm](https://github.com/Pana/nrm)

```bash
npm i -g nrm
```

切换淘宝源

```bash
nrm use taobao
```

查看当前使用的源

```bash
nrm ls
```

会列出当前所支持的源地址，前面加星号的为当前使用的源

## 安装 Yarn

plume 推荐使用`yarn`来代替 npm 管理、安装依赖

```bash
npm i -g yarn
```

## 加速 node-sass 等安装速度

有的模块，只改变安装源，并不能加速下载，此时，需要修改针对它自身的安装源。

这些需要添加到安装`nvm`时，使用的那个`.zshrc`/`.profile`/`.bash_profile`文件

一些常用的模块加速

electron,node-sass,phantomjs,homebrew(MacOS),nvm

```bash
# ========= FAST PACKAGES INSTALL ========= #
# faster electron download
export ELECTRON_MIRROR="https://npm.taobao.org/mirrors/electron/"
# faster node-sass download
export sass_binary_site="https://npm.taobao.org/mirrors/node-sass/"
# faster phantomjs
phantomjs_cdnurl="https://cdn.npm.taobao.org/dist/phantomjs"
# Homebrew Bottles
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.ustc.edu.cn/homebrew-bottles"
# NVM
export NVM_NODEJS_ORG_MIRROR="https://npm.taobao.org/mirrors/node"
# ============ FAST PACKAGES INSTALL END ======= #
```
