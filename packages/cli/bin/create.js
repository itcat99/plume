/* eslint no-console:0 */
const path = require("path");
const fse = require("fs-extra");
const child_process = require("child_process");
const { spawn, spawnSync } = child_process;

const mkPackage = (name, projectPath, eslint, jest) => {
  const data = {
    name,
    version: "0.0.1",
    main: "index.js",
    license: "MIT",
    scripts: {
      dev: "plume-core dev",
      build: "plume-core build",
    },
  };

  if (eslint) {
    data["husky"] = {
      hooks: {
        "pre-commit": "precise-commits",
      },
    };
  }

  if (jest) data.scripts["test"] = "jest";

  fse.writeFileSync(path.join(projectPath, `package.json`), JSON.stringify(data, null, 2));
};

const installDependents = (projectPath, dependents, dev) => {
  return new Promise((resolve, reject) => {
    let vals = ["add"];
    dev && vals.push("-D");
    vals = vals.concat(dependents);

    const yarnStdout = spawn("yarn", vals, {
      cwd: projectPath,
    });

    const loading = loader(`install ${dev ? "DevDependents" : "dependents"}`);

    yarnStdout.stdout.on("error", err => {
      delLoader(loading);
      reject(err);
    });
    yarnStdout.on("close", async () => {
      delLoader(loading);
      resolve();
    });
  });
};

const yarnInstall = async (projectPath, flow, eslint, jest) => {
  process.stdout.write("\n> Yarn Install\n");
  const dependents = [
    "@babel/runtime",
    "react",
    "react-dom",
    "react-router-dom",
    "react-loadable",
    "@plume/core",
  ];
  flow && dependents.push("@plume/flow");
  let devDependents = jest ? ["jest"] : [];

  try {
    await installDependents(projectPath, dependents);
    if (eslint) {
      devDependents = [].concat(devDependents, [
        "eslint",
        "babel-eslint",
        "eslint-config-prettier",
        "eslint-plugin-prettier",
        "eslint-plugin-react",
        "precise-commits",
        "prettier",
        "husky",
      ]);
    }
    if (devDependents.length) await installDependents(projectPath, devDependents, true);
  } catch (error) {
    throw new Error(error);
  }
};

const createEslint = projectPath => {
  const tempPath = path.resolve(__dirname, "..", "templates", "eslint");
  fse
    .readdir(tempPath)
    .then(files => {
      files.forEach(file => {
        fse.copyFileSync(path.join(tempPath, file), path.join(projectPath, file));
      });
    })
    .catch(err => console.error("Create eslint error: ", err));
};

const initGit = projectPath => {
  process.stdout.write(`\n> initialize git\n`);
  spawnSync("git", ["init"], {
    cwd: projectPath,
  });
};

const loader = msg => {
  process.stdout.write("\n");
  const p = ["\\", "|", "/", "-"];

  let x = 0;
  return setInterval(() => {
    process.stdout.write(`\r${p[x++]} ${msg}`);
    x = x >= p.length ? 0 : x;
  }, 200);
};

const delLoader = (name, msg = "") => {
  clearInterval(name);
  process.stdout.write(`\n${msg}`);
};

module.exports = (name, targetPath, flow, eslint, jest, skip) => {
  // fse.mkdirSync(path.join(targetPath, name));
  const projectPath = path.join(targetPath, name);
  const tempPath = path.resolve(__dirname, "..", "templates", flow ? "project-flow" : "project");

  fse.copySync(tempPath, projectPath);
  mkPackage(name, projectPath, eslint, jest);
  initGit(projectPath);

  eslint && createEslint(projectPath);

  if (skip) {
    process.stdout.write(
      `>> You must run "yarn add react react-dom react-router-dom react-loadable @babel/runtime" to install devendents.\n`,
    );

    eslint &&
      process.stdout.write(
        `>> You must run "yarn add -D eslint babel-eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-react precise-commits prettier husky" to install devDependents.\n`,
      );
  } else {
    yarnInstall(projectPath, flow, eslint, jest)
      .then(() => {
        process.stdout.write("\n> Yarn Install is done.\n");

        const plumeStart = spawn("yarn", ["dev"], {
          cwd: projectPath,
        }).stdout;
        plumeStart.on("data", data => console.log(data.toString()));
        plumeStart.on("error", err => console.error(err.toString()));
      })
      .catch(err => console.error("Install dependents error: ", err));
  }
};
