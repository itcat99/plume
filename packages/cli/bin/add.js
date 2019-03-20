const path = require("path");
const fse = require("fs-extra");

/**
 * 检查文件/文件夹是否存在
 * @param {string} targetPath 目标文件路径
 * @param {boolean} 返回true or false
 */
const isExist = targetPath => {
  try {
    fse.statSync(targetPath);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = (name, types, targetPath) => {
  const { model, page, container } = types;

  if (model && !targetPath)
    throw new Error(
      "Add a new [Model], you must have a target path. \n try '@plume/cli add [MODEL_NAME] [TARGET_PATH] -m' again. ",
    );

  const rootPath = process.cwd();

  if (targetPath && !path.isAbsolute(targetPath)) {
    targetPath = path.join(rootPath, targetPath);
  }
  let plumeDirPath = path.join(rootPath, ".plume");
  const customConfig = path.join(rootPath, "plume.config.js");

  if (!isExist(plumeDirPath) && isExist(customConfig)) {
    const config = require(customConfig);

    if (config.paths && config.paths.plume) {
      plumeDirPath = config.paths.plume;
    }
  }

  const plumeConfig = path.join(plumeDirPath, "config.js");
  if (!isExist(plumeConfig)) {
    throw new Error("Can't find plume config.js");
  }

  const config = require(plumeConfig);
  const { paths } = config;

  const type = model ? "model" : page ? "page" : container ? "container" : "component";
  const _path = model ? targetPath : path.join(targetPath || paths[`${type}s`], name);
  if (isExist(_path)) throw new Error(`[${name}] directory already exists `);
  fse.mkdirSync(_path);

  switch (type) {
    case "container": {
      fse.writeFileSync(
        path.join(_path, "index.jsx"),
        `
        import React, { Component } from "react";
        import { createContainer } from "@plume/flow";

        class ${name[0].toUpperCase()}${name.slice(1)} extends Component{
          render(){
            return <div>${name} component</div>
          }
        }

        export default createContainer(${name[0].toUpperCase()}${name.slice(1)});
      `,
      );
      break;
    }
    case "page": {
      fse.writeFileSync(
        path.join(_path, "index.jsx"),
        `
        import React, { Component } from "react";

        export default () => <div>${name} page.</div>
      `,
      );
      break;
    }
    case "model": {
      fse.writeFileSync(
        path.join(_path, `${name}.js`),
        `
        export default {
          namespace: ${name},
          state: 0,
          reducer: {
            plus: state => state + 1,
            minus: state => state - 1,
          },
          effecet: {
            asyncPlus: actions => {
              setTimeout(() => actions[${name}].plus(), 300);
            },
            asyncMinus: actions => {
              setTimeout(() => actions[${name}].minus(), 300);
            }
          }
        }
      `,
      );
      break;
    }
    default: {
      fse.writeFileSync(
        path.join(_path, "index.jsx"),
        `
      import React, { PureComponent } from "react";

      class ${name[0].toUpperCase()}${name.slice(1)} extends PureComponent{
        render(){
          return <div>Hello ${name} Component</div>;
        }
      }
      export default ${name[0].toUpperCase()}${name.slice(1)};
    `,
      );
      return;
    }
  }

  process.stdout.write(`add ${name} ${type} is done. \npath:${_path}\n`);
};
