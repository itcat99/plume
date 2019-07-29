const { spawnSync } = require("@plume/helper");

module.exports = projectPath => {
  spawnSync("git", ["init"], {
    cwd: projectPath,
  });
};
