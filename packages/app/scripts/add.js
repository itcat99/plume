const { path } = require("@plume/helper");
const fse = require("fs-extra");
const { task, isExist, makeDirSync } = require("@plume/helper");

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

module.exports = opts => {
  let { name, types, targetPath } = opts;
  const { model, page, container } = types;

  if (model && !targetPath)
    throw new Error(
      "Add a new [Model], you must have a target path. \n try '@plume/cli add [MODEL_NAME] [TARGET_PATH] -m' again. ",
    );
  if (targetPath && !path.isAbsolute(targetPath)) {
    targetPath = path.join(process.cwd(), targetPath);
  }

  const { paths } = opts.config;
  const type = model ? "model" : page ? "page" : container ? "container" : "component";
  const dirPath = model ? targetPath : path.join(targetPath || paths[`${type}s`], name);

  if (!isExist(dirPath)) {
    makeDirSync(dirPath);
  } else {
    if (!model) throw new Error(`[${name}] directory already exists.`);
    if (isExist(path.join(dirPath, name))) throw new Error(`[${name}] model file already exists.`);
  }

  task("create module", createModule(type, name, dirPath), {
    success: `add '${name}' ${type} is done. \npath:${dirPath}\n`,
  });
};
