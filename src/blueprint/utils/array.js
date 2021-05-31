/**
 * 判断变量是否是数组
 * @param {*} o
 * @returns
 */
export function isArray(o) {
  return Object.prototype.toString.call(o) == "[object Array]";
}

/**
 * 合并两个数组
 * @param {*} arr1
 * @param {*} arr2
 * @returns
 */
export function mergeArray(arr1, arr2) {
  arr1 = isArray(arr1) ? arr1 : [arr1];
  arr2 = isArray(arr2) ? arr2 : [arr2];
  return arr1.reduce((pre, cur) => {
    pre.push(cur);
    return pre;
  }, arr2);
}
