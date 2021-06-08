export function isArray(o) {
  return Object.prototype.toString.call(o) == "[object Array]";
}

export function mergeArray(arr1, arr2) {
  arr1 = isArray(arr1) ? arr1 : [arr1];
  arr2 = isArray(arr2) ? arr2 : [arr2];
  return arr1.reduce((pre, cur) => {
    pre.push(cur);
    return pre;
  }, arr2);
}
