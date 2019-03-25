const path = require("path");
const fse = require("fs-extra");
const { relativePostion, isExist } = require("./helper");
const template = require("./template");

module.exports = (plume, pages) => {
  const relativePath = relativePostion(plume, pages);
  const targetFilePath = path.join(plume, "Router.jsx");

  let errorPages = relativePostion(plume, isExist(path.join(pages, "404")) ? pages : plume);

  const data = template(path.resolve(__dirname, "../src", "Router.jsx"), {
    relativePath,
    errorPages,
  });

  fse.writeFileSync(targetFilePath, data);
};
