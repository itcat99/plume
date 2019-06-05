/* eslint no-console:0 */
const fse = require("fs-extra");
const path = require("path");
const { isDir } = require("@plume/helper");
const chalk = require("chalk");

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
const getCompPath = (parentPath, dirName, file) =>
  `${parentPath || ""}/${dirName}${file ? "/" + file : ""}`;
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
 * @param {object[]} layoutPaths 布局目录集合
 *
 */
const getPageInfo = (dirPath, parent = null, info = [], permissionPaths = [], layoutPaths = []) => {
  const dirName = dirPath.split("/").reverse()[0];
  const files = fse.readdirSync(dirPath);

  /* 获取author组件地址 */
  const authorInfo = getGeneralFileInDirectoryAndCollection(
    "_Author",
    dirPath,
    parent,
    permissionPaths,
  );
  const authorCmpPath = authorInfo.targetPath;
  permissionPaths = authorInfo.collection;

  /* 获取layout组件地址 */
  const layoutInfo = getGeneralFileInDirectoryAndCollection(
    "_Layout",
    dirPath,
    parent,
    layoutPaths,
  );
  const layoutCmpPath = layoutInfo.targetPath;
  layoutPaths = layoutInfo.collection;

  files.forEach(file => {
    const filePath = path.join(dirPath, file);

    if (isDir(filePath)) {
      const nextParent = `${parent || ""}/${getDynamicName(dirName)}`;
      info = getPageInfo(filePath, nextParent, info, permissionPaths, layoutPaths);
    } else {
      if (!file.match(/\.(js|jsx)?$/)) return true;
      if (file.match(/_Author\.(js|jsx)?$/)) return true;
      if (file.match(/_Layout\.(js|jsx)?$/)) return true;

      const urlTitle = getUrlTitle(file);
      info.unshift({
        title: urlTitle === "index" ? dirName : urlTitle,
        path: getUrlPath(parent, dirName, urlTitle),
        component: getCompPath(parent, dirName, file),
        exact: urlTitle === "index" ? true : false,
        author: authorCmpPath || false,
        layout: layoutCmpPath || false,
      });
    }
  });

  return info;
};

/**
 * 获取目标js,jsx文件
 * @param {string[]} files 目标文件集合
 * @param {string} name 文件名
 * @return {array}
 */
const getFile = (files, name) => files.filter(val => val.match(new RegExp(`${name}.(js|jsx)$`)));

/**
 * 在目录或集合内搜索通用文件
 * 如果当前目录有目标文件，则使用当前目录的目标文件
 * 如果没有，搜索集合内是否有父级目录，如果有，则使用父级的目标文件
 *
 * @param {string} target 目标文件名
 * @param {string} dir 目录地址
 * @param {string} parentRoute 父级路由地址
 * @param {object[]} collection 集合
 * @param {string} collection.path 目录地址
 * @param {string} collection.targetPath 目标文件地址
 * @returns {object} 返回targetPath和新的collection
 */
const getGeneralFileInDirectoryAndCollection = (target, dir, parentRoute, collection) => {
  let targetPath;
  const dirName = dir.split("/").reverse()[0];
  const files = fse.readdirSync(dir);
  const targetFiles = getFile(files, target);

  if (targetFiles.length > 0) {
    // 只拿搜索到的第一个目标文件
    targetPath = getCompPath(parentRoute, dirName, targetFiles[0]);
    collection.push({
      path: `${parentRoute || ""}/${dirName}`,
      targetPath,
    });
  } else {
    const parentAuthorFile = collection.filter(item => dir.indexOf(item.path) >= 0);
    if (parentAuthorFile.length > 0) targetPath = parentAuthorFile[0].targetPath;
  }

  return { targetPath, collection };
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
    const permissionPaths = [],
      layoutPaths = [];

    let pagesInfo = [];
    const result = fse.readdirSync(pagesPath);
    /* 获取全局的Author */
    const authorCmpPath = getFile(result, "_Author")[0];
    if (authorCmpPath) permissionPaths.push({ path: pagesPath, targetPath: `/${authorCmpPath}` });
    /* 获取全局的Layout */
    const layoutCmpPath = getFile(result, "_Layout")[0];
    if (layoutCmpPath) layoutPaths.push({ path: pagesPath, targetPath: `/${layoutCmpPath}` });

    for (const key in result) {
      const item = result[key];
      if (item.match(/^404$/)) continue;

      const _path = path.join(pagesPath, item);
      if (isDir(_path)) {
        pagesInfo = pagesInfo.concat(getPageInfo(_path, null, [], permissionPaths, layoutPaths));
      }
    }

    fse.writeFile(path.join(plumePath, "pagesInfo.json"), JSON.stringify(pagesInfo, null, 2));
  } catch (error) {
    console.error(chalk.red("> Error in [createPagesInfo]: ", error));
    process.exit(1);
  }
};
