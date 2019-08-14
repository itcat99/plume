/* 格式化不同平台在import引用的路径 */
module.exports = path => {
  if (process.platform === "win32") return path.replace(/\\/g, "/");
  return path;
};
