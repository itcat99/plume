const path = require("path");
const fse = require("fs-extra");
const isExist = require("./isExist.js");

const makeDirSync = targetPath => {
  if (!path.isAbsolute(targetPath)) throw new Error("must be an absolute path.");
  let _p = "";
  const pathArr = targetPath.split("/").filter(a => a);

  pathArr.forEach(item => {
    _p += `/${item}`;
    if (!isExist(_p)) {
      fse.mkdirSync(_p);
    }
  });
};

module.exports = makeDirSync;
