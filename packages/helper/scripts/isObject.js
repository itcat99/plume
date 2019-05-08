/**
 * 是否为Object
 * @param {object} obj
 * @return {boolean}
 */
module.exports = obj => Object.prototype.toString.call(obj).indexOf("Object") >= 0;
