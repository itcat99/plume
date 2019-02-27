const path = require("path");
const fse = require("fs-extra");

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
