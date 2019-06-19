const isObject = require("./isObject");

/**
 * 深合并对象
 * @param {object} origin 目标对象
 * @param {object} target 要合并进去的对象
 * @return {object}
 */
const deepAssign = (origin, target) => {
  const tempObj = Object.assign({}, origin);

  for (const key in target) {
    if (isObject(origin[key]) && target[key]) {
      tempObj[key] = deepAssign(origin[key], target[key]);
    } else {
      tempObj[key] = target[key];
    }
  }

  return tempObj;
};

module.exports = deepAssign;
