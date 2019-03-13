const fse = require("fs-extra");
const path = require("path");
const { isDir } = require("../scripts/helper");
/* eslint no-console:0 */

const getUrlPath = (parentPath, dirName, title) => {
  if (!parentPath && !!dirName.match(/^(H|h)ome?/)) {
    return "/";
  }

  return `${parentPath || ""}/${dirName}${title === "index" ? "" : "/" + title}`;
};
const getCompPath = (parentPath, dirName, file) => `${parentPath || ""}/${dirName}/${file}`;
const getUrlTitle = title => {
  const result = title.match(/\.(js|jsx)?$/);
  if (result) return title.split(result[0])[0];

  return title;
};

const getPageInfo = (dirPath, parent = null, info = []) => {
  const dirName = dirPath.split("/").reverse()[0];
  const files = fse.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);

    if (isDir(filePath)) {
      const nextParent = `${parent || ""}/${dirName}`;
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
