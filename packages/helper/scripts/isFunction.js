/**
 * 是否为Function
 * @param {function} fun
 * @return {boolean}
 */
module.exports = fun => Object.prototype.toString.call(fun).indexOf("Function") >= 0;
