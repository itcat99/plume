/* eslint no-console:0 */
const path = require("path");
const fse = require("fs-extra");
const { spawn } = require("child_process");

const mkPackage = (name, projectPath) => {
  fse.writeFileSync(
    path.join(projectPath, `package.json`),
    JSON.stringify(
      {
        name,
        version: "0.0.1",
        main: "index.js",
        license: "MIT",
        scripts: {
          dev: "plume-core dev",
          build: "plume-core build",
        },
      },
      null,
      2,
    ),
  );
};

const installDependents = (projectPath, flow) => {
  const dependents = ["@plume/core"];
  flow && dependents.push("@plume/flow");

  const yarnStdout = spawn("yarn", ["add"].concat(dependents), {
    cwd: projectPath,
  });

  yarnStdout.stdout.on("data", data => console.log(data.toString()));
  yarnStdout.on("close", () => {
    console.log("> install dependents is done.");

    const plumeStart = spawn("yarn", ["dev"], {
      cwd: projectPath,
    }).stdout;
    plumeStart.on("data", data => console.log(data.toString()));
    plumeStart.on("error", err => console.error(err.toString()));
  });
};

module.exports = (name, targetPath, flow) => {
  // fse.mkdirSync(path.join(targetPath, name));
  const projectPath = path.join(targetPath, name);
  const tempPath = path.resolve(__dirname, "..", "templates", flow ? "project-flow" : "project");

  fse.copySync(tempPath, projectPath);
  mkPackage(name, projectPath);
  installDependents(projectPath, flow);
};
