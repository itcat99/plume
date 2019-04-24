const { spawn } = require("child_process");

module.exports = (projectPath, dependents, dev) => {
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
