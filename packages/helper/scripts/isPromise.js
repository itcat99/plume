/**
 * 是否为Promise
 * @param {function} pro
 * @return {boolean}
 */
module.exports = pro => Object.prototype.toString.call(pro).indexOf("Promise") >= 0;
