const path = require("path");
const fse = require("fs-extra");

/**
 * 收集model并生成models.js文件
 * @param {string} dirPath 存放model的目录路径
 * @param {string} plumePath 输出的plume目录路径
 */
module.exports = (dirPath, outPath) => {
  const models = fse.readdirSync(dirPath);
  let modelsImport = "";
  let modelsExport = "";

  models.forEach(model => {
    const modelPath = path.join(dirPath, `${model}`);
    const name = model.split(".")[0];
    modelsImport += `import ${name} for "${modelPath}";\n`;
    modelsExport += `${name},`;
  });

  const info = `${modelsImport}\n export defauult [${modelsExport}]`;
  fse.writeFileSync(path.join(outPath, "models.js"), info);
};
