const fse = require("fs-extra");
const path = require("path");
const { isDir } = require("@plume/helper");
const chalk = require("chalk");

/* eslint no-console:0 */

/**
 * 获取路由的url地址
 * @param {*} parentPath 父级路由地址
 * @param {*} dirName 目录名称
 * @param {*} title 文件名
 */
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
 * 获取组件的动态加载地址
 * @param {string} parentPath 父级组件的地址
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
 * @param {object[]} permissionPaths 有验证机制的目录集合
 * @param {string} permissionPaths.path 有验证机制的目录
 * @param {string} permissionPaths.authorCmpPath 验证文件目录
 *
 */
const getPageInfo = (dirPath, parent = null, info = [], permissionPaths = []) => {
  const dirName = dirPath.split("/").reverse()[0];
  const files = fse.readdirSync(dirPath);
  const authorFile = getAuthor(files);
  let authorCmpPath;

  /* 如果当前目录有Author文件，则使用当前目录的，如果没有，搜索permissionPaths内是否有父级目录，如果有，则使用父级的Author */
  if (authorFile.length > 0) {
    // 只拿搜索到的第一个Author文件
    authorCmpPath = getCompPath(parent, dirName, authorFile[0]);
    permissionPaths.push({
      path: `${parent || ""}/${dirName}`,
      authorCmpPath,
    });
  } else {
    const parentAuthorFile = permissionPaths.filter(item => dirPath.indexOf(item.path) >= 0);
    if (parentAuthorFile.length > 0) authorCmpPath = parentAuthorFile[0].authorCmpPath;
  }

  files.forEach(file => {
    const filePath = path.join(dirPath, file);

    if (isDir(filePath)) {
      const nextParent = `${parent || ""}/${getDynamicName(dirName)}`;
      info = getPageInfo(filePath, nextParent, info, permissionPaths);
    } else {
      if (!file.match(/\.(js|jsx)?$/)) return true;
      if (file.match(/Author\.(js|jsx)?$/)) return true;

      const urlTitle = getUrlTitle(file);
      info.unshift({
        title: urlTitle === "index" ? dirName : urlTitle,
        path: getUrlPath(parent, dirName, urlTitle),
        component: getCompPath(parent, dirName, file),
        exact: urlTitle === "index" ? true : false,
        author: authorCmpPath || false,
      });
    }
  });

  return info;
};

/**
 * 获取Author文件
 * @param {string[]} files 目标文件集合
 * @return {array}
 */
const getAuthor = files => files.filter(val => val.match(/Author\.(js|jsx)$/));

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
    for (const key in result) {
      const item = result[key];
      if (item.match(/^404$/)) continue;

      const _path = path.join(pagesPath, item);
      if (isDir(_path)) {
        pagesInfo = pagesInfo.concat(getPageInfo(_path));
      }
    }

    fse.writeFile(path.join(plumePath, "pagesInfo.json"), JSON.stringify(pagesInfo, null, 2));
  } catch (error) {
    console.error(chalk.red("> Error in [createPagesInfo]: ", error));
    process.exit(1);
  }
};
