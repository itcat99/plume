const path = require("path");
const isExist = require("./isExist");

/**
 * 查找项目内的可执行文件
 * @param {string} name 可执行文件名字
 * @return {string} 输出文件路径
 */
module.exports = (name, cwd) => {
  cwd && process.chdir(cwd);
  const nodeModuleDirs = process.mainModule.paths;
  if (!nodeModuleDirs || !nodeModuleDirs.length) throw new Error("Can't find node_modules dir.");
  for (const moduleDir of nodeModuleDirs) {
    const targetPath = path.resolve(moduleDir, ".bin", name);
    if (isExist(targetPath)) {
      return targetPath;
    }
  }

  throw new Error(`Can't find ${name} module.`);
};
