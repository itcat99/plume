const fse = require("fs-extra");
const REG_KEY = /{{.*?}}/g;

/**
 * 简单的模版生成函数 替换 {{KEY}} 内的参数
 * @param {string} targetPath 模板文件路径: '/A/B/C.js'
 * @param {object} options 替换的对象 {key: value}
 * @return 返回文件的字符串
 */
module.exports = (targetPath, options) => {
  let template = fse.readFileSync(targetPath).toString();

  return template.replace(REG_KEY, match => {
    for (const key in options) {
      if (match.indexOf(key) >= 0) {
        return options[key];
      }
    }
  });
};
