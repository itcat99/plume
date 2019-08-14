const path = require("path");
const fse = require("fs-extra");
const isExist = require("./isExist.js");

const makeDirSync = targetPath => {
  if (!path.isAbsolute(targetPath)) throw new Error("must be an absolute path.");

  let _p = "";
  const { sep } = path;
  const pathArr = targetPath.split(sep).filter(a => a);

  pathArr.forEach(item => {
    let sub = process.platform === "win32" ? `${item}${sep}` : `${sep}${item}`;
    _p += sub;
    if (!isExist(_p)) {
      fse.mkdirSync(_p);
    }
  });
};

module.exports = makeDirSync;
