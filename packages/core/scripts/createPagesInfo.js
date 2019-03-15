const fse = require("fs-extra");
const path = require("path");
const { isDir } = require("../scripts/helper");
/* eslint no-console:0 */

const getUrlPath = (parentPath, dirName, title) => {
  if (!parentPath && !!dirName.match(/^(H|h)ome?/)) {
    return "/";
  }

  let name = getDynamicName(title);
  name = title === "index" ? "" : `/${name}`;
  dirName = getDynamicName(dirName);

  return `${parentPath || ""}/${dirName}${name}`;
};
/**
 * 获取组件的路由地址
 * @param {string} parentPath 父级路由地址
 * @param {string} dirName 目录名称
 * @param {string} file 文件名
 * @return {string}
 */
const getCompPath = (parentPath, dirName, file) => `${parentPath || ""}/${dirName}/${file}`;
/**
 * 获取文件名
 * @param {string} title
 * @return {string}
 */
const getUrlTitle = title => {
  const result = title.match(/\.(js|jsx)?$/);
  if (result) return title.split(result[0])[0];

  return title;
};

/**
 * 获取目录下的文件的url映射
 * @param {string} dirPath 目录地址
 * @param {string} parent 父级路由
 * @param {object[]} info url映射数组
 * @param {object[]}
 */
const getPageInfo = (dirPath, parent = null, info = []) => {
  const dirName = dirPath.split("/").reverse()[0];
  const files = fse.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);

    if (isDir(filePath)) {
      const nextParent = `${parent || ""}/${getDynamicName(dirName)}`;
      info = getPageInfo(filePath, nextParent, info);
    } else {
      const urlTitle = getUrlTitle(file);
      info.unshift({
        title: urlTitle === "index" ? dirName : urlTitle,
        path: getUrlPath(parent, dirName, urlTitle),
        component: getCompPath(parent, dirName, file),
        exact: urlTitle === "index" ? true : false,
      });
    }
  });

  return info;
};

/**
 * 获取动态路由的url路径名称
 * $id --> :id
 * id$ --> :id?
 *
 * @param {string} name 文件名称
 * @return {string}
 */
const getDynamicName = name => {
  return name.match(/^\$.*[^$]$/)
    ? `:${name.slice(1)}`
    : name.match(/^[^$].*\$$/)
    ? `:${name.slice(0, -1)}?`
    : name;
};
/**
 * 生成页面文件信息
 * @param {string} pagesPath 页面文件存放的目录路径
 * @param {string} plumePath 输出的plume目录路径
 */
module.exports = (pagesPath, plumePath) => {
  try {
    let pagesInfo = [];
    const result = fse.readdirSync(pagesPath);
    result.forEach(item => {
      const _path = path.join(pagesPath, item);
      if (isDir(_path)) {
        pagesInfo = pagesInfo.concat(getPageInfo(_path));
      }
    });

    fse.writeFile(path.join(plumePath, "pagesInfo.json"), JSON.stringify(pagesInfo, null, 2));
    console.log("> create pagesInfo.json is done.");
  } catch (error) {
    console.error("> Error in [createPagesInfo]: ", error);
    process.exit(1);
  }
};
