/**
 * 判断是否为空对象
 * @param obj 目标对象
 */
export const isEmptyObject = (obj: any): boolean => !Object.keys(obj).length;

export const isFunction = (func: any) => typeof func === "function";
export const isArray = (arr: any) => Array.isArray(arr);
export const isNumber = (num: any) => {
  if (!Number.isFinite(num) || Number.isNaN(num)) return false;
  return Object.prototype.toString.call(num).indexOf("Number") >= 0;
};
export const isObject = (obj: any) => {
  if (isFunction(obj) || isArray(obj)) return false;

  return Object.prototype.toString.call(obj).indexOf("Object") >= 0;
};
export const isAsyncFunction = (func: any) =>
  Object.prototype.toString.call(func).indexOf("AsyncFunction") >= 0;
