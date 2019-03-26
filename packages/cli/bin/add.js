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

/**
 * 创建模块
 * @param {string} type 目标module类型
 * @param {string} name 目标module名称
 * @param {string} dirPath 目标目录
 */
const createModule = (type, name, dirPath) => {
  let moduleName = `${name[0].toUpperCase()}${name.slice(1)}`;
  let filePath = path.join(dirPath, "index.jsx");
  if (type === "model") {
    moduleName = name;
    filePath = path.join(dirPath, `${name}.js`);
  }

  let data = fse
    .readFileSync(path.resolve(__dirname, "../templates/modules", `${type}.js`))
    .toString()
    .replace(/NAME/g, moduleName);

  fse.writeFileSync(filePath, data);
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
  const dirPath = model ? targetPath : path.join(targetPath || paths[`${type}s`], name);

  if (!isExist(dirPath)) {
    fse.mkdirSync(dirPath);
  } else {
    if (!model) throw new Error(`[${name}] directory already exists.`);
    if (isExist(path.join(dirPath, name))) throw new Error(`[${name}] model file already exists.`);
  }

  createModule(type, name, dirPath);
  process.stdout.write(`add ${name} ${type} is done. \npath:${dirPath}\n`);
};
