/**
 * 获取webpack clean plugin的options
 * @param {*} outPath 输出目录
 */
module.exports = outPath => {
  const pathArr = outPath.trim().split("/");
  const dir = pathArr[pathArr.length - 1];
  const root = pathArr.slice(0, pathArr.length - 1).join("/");

  return {
    dir,
    root,
  };
};
