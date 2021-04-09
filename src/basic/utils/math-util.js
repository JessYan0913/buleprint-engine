/**
 * 计算两点间直线的斜率
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @returns
 */
export function linearSlope(x1, y1, x2, y2) {
  return (y2 - y1) / (x2 - x1);
}

/**
 * 求两点间的距离
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @returns
 */
export function twoPointsDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/**
 * 求直线上距离起点 (x1,y1) h距离的点
 * @param {Number} slope 斜率
 * @param {Number} x1 起点坐标
 * @param {Number} y1 起点坐标
 * @param {Number} h 距离，当距离为负时，方向相反
 * @returns
 */
export function linearDistancePoint(slope, x1, y1, h) {
  const p = Math.sqrt(1 + slope * slope);
  return {
    x: h / p + x1,
    y: isNaN((slope * h) / p) ? y1 + h : (slope * h) / p + y1,
  };
}
