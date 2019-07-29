const { spawnSync } = require("child_process");

module.exports = (command, args, opts = {}) => {
  const options = Object.assign(
    {
      shell: process.platform === "win32",
    },
    opts,
  );

  return spawnSync(command, args, options);
};
