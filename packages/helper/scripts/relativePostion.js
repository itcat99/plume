/**
 * 获取两个路径间的相对位置 (a, b) -> b路径相对于a的位置
 * @param {*} a 当前的路径
 * @param {*} b 目标路径
 */
module.exports = (a, b) => {
  if (a === b) return ".";
  const p1 = a.split("/");
  const p2 = b.split("/");
  let tempIndex = 0;
  let result = "";

  for (let i = 0; i < p1.length; i++) {
    if (p1[i] === p2[i]) {
      tempIndex = i;

      if (i === p1.length - 1) {
        result = `./${p2.slice(tempIndex).join("/")}`;

        return result;
      }
    } else {
      result += "../";
    }
  }

  return `${result}${p2.slice(tempIndex + 1).join("/")}`;
};
