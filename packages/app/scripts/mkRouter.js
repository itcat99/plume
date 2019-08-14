const path = require("path");
const fse = require("fs-extra");
const { isExist, normalizedPath } = require("@plume/helper");
const template = require("./template");

module.exports = (plume, pages) => {
  let relativePath = path.relative(plume, pages);
  const targetFilePath = path.join(plume, "Router.jsx");

  let errorPages = path.relative(plume, isExist(path.join(pages, "404")) ? pages : plume);

  const data = template(path.resolve(__dirname, "../templates/plume", "Router.jsx"), {
    relativePath: relativePath === "" ? "." : normalizedPath(relativePath),
    errorPages: errorPages === "" ? "." : normalizedPath(errorPages),
  });

  fse.writeFileSync(targetFilePath, data);
};
