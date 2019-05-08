/* eslint no-console:0 */
const path = require("path");
const fse = require("fs-extra");
const { isDir } = require("@plume/helper");

const IGONRE_DIRS = ["node_modules", ".plume"];

/**
 * 获取在当前项目下所有名称为 \[models\]的目录
 * @param {string} rootPath 当前项目根目录
 * @param {array} dirPaths models目录数组
 * @return {array} 返回models目录的数组
 */
const getModelDirs = (rootPath, dirPaths = []) => {
  const currentDirs = fse.readdirSync(rootPath);

  for (const index in currentDirs) {
    const dirName = currentDirs[index];

    if (IGONRE_DIRS.indexOf(dirName) >= 0) continue;
    const tempPath = path.join(rootPath, dirName);
    if (isDir(tempPath)) {
      if (dirName === "models") {
        dirPaths.push(tempPath);
      }

      dirPaths = getModelDirs(tempPath, dirPaths);
    }
  }

  return dirPaths;
};
/**
 * 收集model并生成models.js文件
 * @param {string} dirPath 存放model的目录路径
 * @param {string} plumePath 输出的plume目录路径
 */
module.exports = (rootPath, outPath) => {
  const modelPaths = getModelDirs(rootPath);
  let modelsImport = "";
  let modelsExport = "";

  modelPaths.forEach(dirPath => {
    const models = fse.readdirSync(dirPath);

    models.forEach(model => {
      const modelPath = path.join(dirPath, `${model}`);
      if (isDir(modelPath)) {
        return true;
      }
      const namespace = fse
        .readFileSync(modelPath)
        .toString()
        .match(/namespace.*("|')/);
      if (!namespace) return true;

      const name = namespace[0]
        .match(/("|').*("|')/)[0]
        .replace(/("|')/g, "")
        .trim();
      modelsImport += `import ${name} from "${modelPath}";\n`;
      modelsExport += `${name},`;
    });
  });

  const info = `${modelsImport}\n export default [${modelsExport}]`;
  fse.writeFileSync(path.join(outPath, "models.js"), info);
};
