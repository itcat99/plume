const { path } = require("@plume/helper");
const fse = require("fs-extra");
const { task, isExist, makeDirSync } = require("@plume/helper");

/**
 * 创建模块
 * @param {string} type 目标module类型
 * @param {string} name 目标module名称
 * @param {string} dirPath 目标目录
 * @param {string} mode 项目模式 app|lib
 */
const createModule = (type, name, dirPath, mode) => {
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

  if (type === "component" && mode === "lib") {
    let data = fse
      .readFileSync(path.resolve(__dirname, "../templates/modules", "doc.mdx"))
      .toString()
      .replace(/NAME/g, moduleName)
      .replace(/ROUTE/g, `/${moduleName.toLowerCase()}`);

    fse.writeFileSync(path.join(dirPath, `${moduleName}.mdx`), data);
  }
};

module.exports = opts => {
  let { name, types, targetPath, config } = opts;
  const { model, page, container } = types;
  const { mode } = config;

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

  if (mode === "lib" && type !== "component") return;
  if (!isExist(dirPath)) {
    makeDirSync(dirPath);
  } else {
    if (!model) throw new Error(`[${name}] directory already exists.`);
    if (isExist(path.join(dirPath, name))) throw new Error(`[${name}] model file already exists.`);
  }

  task("create module", createModule(type, name, dirPath, mode), {
    success: `add '${name}' ${type} is done. \npath:${dirPath}\n`,
  });
};
