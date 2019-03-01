const fse = require("fs-extra");
const path = require("path");
/* eslint no-console:0 */

/**
 * 生成页面文件信息
 * @param {string} pagesPath 页面文件存放的目录路径
 * @param {string} plumePath 输出的plume目录路径
 */
module.exports = (pagesPath, plumePath) => {
  try {
    const result = fse.readdirSync(pagesPath);
    const pages = result.toString().split(",");
    const pagesInfo = [];

    pages.forEach(page => {
      const pagePath = path.join(pagesPath, page);
      const stat = fse.statSync(pagePath);
      if (stat.isDirectory()) {
        pagesInfo.push({
          path: page === "Home" ? "/" : `/${page}`,
          title: page,
        });
      }
    });

    fse.writeFile(path.join(plumePath, "pagesInfo.json"), JSON.stringify(pagesInfo, null, 2));
    console.log("> create pagesInfo.json is done.");
  } catch (error) {
    console.error("> Error in [createPagesInfo]: ", error);
    process.exit(1);
  }
};
