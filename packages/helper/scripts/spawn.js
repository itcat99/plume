/* eslint no-console:0 */
const { spawn } = require("child_process");

/**
 * 运行cli命令 spawn
 * @param {string} command cli命令或命令路径
 * @param {array} args cli命令附加参数
 * @param {object} opts 配置项
 * @param {Promise}
 */
module.exports = (command, args, opts = {}) => {
  const { print = true, ...options } = opts;
  let msg = "";

  return new Promise((resolve, reject) => {
    const result = spawn(
      command,
      [].concat(args, ["--color"]),
      Object.assign(
        {
          shell: process.platform === "win32",
        },
        options,
      ),
    );
    result.stdout.on("data", data => {
      print && process.stdout.write(`${data.toString()}\r`);
    });

    result.stderr.on("data", data => {
      msg += data.toString();
      print && console.log(msg);
    });

    result.on("exit", code => {
      if (code === 1) reject(msg);

      resolve();
    });
  });
};
