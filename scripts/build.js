const path = require("path");
const fse = require("fs-extra").promises;

const packagePath = path.resolve(__dirname, "..", "packages");

const transform = async () => {
  const moduleDirs = await fse.readdir(packagePath);
  console.log("moduleDirs: ", moduleDirs);
  moduleDirs.forEach(async dir => {
    const indexFile = path.join(packagePath, dir, "src", "index.js");
    const data = await fse.readFile(indexFile);

    console.log("data: ", data.toString());
  });
};

transform();
