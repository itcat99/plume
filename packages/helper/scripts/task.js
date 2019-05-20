const ora = require("ora");
const spinner = ora();
const isPromise = require("./isPromise");
const Status = function(name, texts) {
  this.start = texts && texts.start ? texts.start : `[${name}] task running...`;
  this.fail = texts && texts.fail ? texts.fail : `[${name}] task failed.`;
  this.success = texts && texts.success ? texts.success : `[${name}] task is done.`;
};

/**
 * 为任务添加spinner
 * @param {string} name 任务名字
 * @param {any} result 任务返回值
 * @param {null | object} texts 自定义字段
 * @param {string} texts.start 当任务开始时
 * @param {string} texts.fail 当任务失败时
 * @param {string} texts.success 当任务完成时
 * @returns {undefined | Promise}
 */
module.exports = (name, result, texts = null) => {
  const status = new Status(name, texts);
  spinner.start(status.start);

  if (isPromise(result)) {
    return result
      .then(() => {
        spinner.succeed(status.success);
      })
      .catch(err => {
        spinner.fail(`${status.fail} : ${err}`);
        process.exit(1);
      });
  } else {
    spinner.succeed(status.success);
  }
};
