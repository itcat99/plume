/**
 * 防抖函数
 * @param {*} cb callback
 * @param {*} time 间隔时间
 */
module.exports = (cb, time) => {
  let timer = null;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => cb(...args), time);
  };
};
