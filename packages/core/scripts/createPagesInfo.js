const fsp = require("fs-extra").promises;
const fse = require("fs-extra");
const path = require("path");

module.exports = (pagesPath, plumePath) => {
  fsp
    .readdir(pagesPath)
    .then(result => {
      const pages = result.toString().split(",");
      const arr = [];

      pages.forEach(page => {
        const pagePath = path.join(pagesPath, page);
        const stat = fse.statSync(pagePath);
        if (stat.isDirectory()) {
          arr.push({ path: page === "Home" ? "/" : `/${page}`, title: page });
        }
      });

      return fse.writeFile(path.join(plumePath, "pagesInfo.json"), JSON.stringify(arr, null, 2));
    })
    .then(() => {
      console.log("> create pagesInfo.json is done.");
    })
    .catch(err => {
      console.error(`> Err: ${err}`);
    });
};
