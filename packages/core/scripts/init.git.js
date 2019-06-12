const { spawnSync } = require("child_process");

module.exports = projectPath => {
  spawnSync("git", ["init"], {
    cwd: projectPath,
  });
};
