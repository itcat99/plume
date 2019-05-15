/**
 * 是否为Function
 * @param {function} fun
 * @return {boolean}
 */
module.exports = obj => Object.prototype.toString.call(obj).indexOf("Function") >= 0;
