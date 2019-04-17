/* eslint no-console:0 */
const path = require("path");
const fse = require("fs-extra");
const child_process = require("child_process");
const task = require("../scripts/task");

const { spawn, spawnSync } = child_process;

const mkPackage = (name, projectPath, eslint, jest) => {
  const data = {
    name,
    version: "0.0.1",
    main: "index.js",
    license: "MIT",
    scripts: {
      initial: "plume-core init",
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

    yarnStdout.stdout.on("error", err => {
      reject(err);
    });
    yarnStdout.on("exit", code => {
      if (code !== 0) reject(`exit code : ${code}`);
    });
    yarnStdout.on("close", () => {
      resolve();
    });
  });
};

const yarnInstall = async (projectPath, flow, eslint, jest) => {
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
    await task("install dependents", installDependents(projectPath, dependents));
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
    if (devDependents.length)
      await task("install devDependents", installDependents(projectPath, devDependents, true));
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
  spawnSync("git", ["init"], {
    cwd: projectPath,
  });
};

const initGitignore = projectPath => {
  fse.copyFileSync(
    path.resolve(__dirname, "..", "templates", "gitignore"),
    path.join(projectPath, ".gitignore"),
  );
};

const copyTemp = (projectPath, flow) => {
  const tempPath = path.resolve(__dirname, "..", "templates", flow ? "project-flow" : "project");
  fse.copySync(tempPath, projectPath);
};

/**
 * @param {object} opts 创建选项
 * @param {string} opts.name 项目名字
 * @param {string} opts.targetPath 项目目录
 * @param {boolean} opts.flow 是否启用@plume/flow
 * @param {boolean} opts.esling 是否启用eslint
 * @param {boolean} opts.jest 是否启用jest
 * @param {boolean} opts.skip 是否跳过安装依赖
 */
module.exports = opts => {
  const { name, targetPath, flow, eslint, jest, skip } = opts;
  const projectPath = path.join(targetPath, name);

  task("copy template", copyTemp(projectPath, flow));
  task("create package.json", mkPackage(name, projectPath, eslint, jest));
  task("initial git", initGit(projectPath));
  task("initial gitignore", initGitignore(projectPath));
  eslint && task("create eslint", createEslint(projectPath));

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
        const plumeStart = spawn("yarn", ["dev"], {
          cwd: projectPath,
        }).stdout;
        plumeStart.on("data", data => console.log(data.toString()));
        plumeStart.on("error", err => console.error(err.toString()));
      })
      .catch(err => console.error("Install dependents error: ", err));
  }
};
