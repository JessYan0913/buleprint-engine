import { isArray } from "./array-util";

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
 * 求直线上距离起点A(x1,y1) 距离h的点
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

/**
 * 计算两点的中点
 * @param {*} x1
 * @param {*} y1
 * @param {*} x2
 * @param {*} y2
 * @returns
 */
export function midpoint(x1, y1, x2, y2) {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2,
  };
}

/**
 * 计算每个重复组件到坐标系的垂直距离
 * @param {*} space
 * @param {*} scale
 * @param {*} realLength
 * @param {*} totalLength
 * @returns
 */
export function calculateSpaces(space, scale, realLength, totalLength) {
  if (isArray(space)) {
    return space.map((item) => scale * item);
  }
  const realSpace = space + realLength;
  const repeatNum = Math.ceil(totalLength / realSpace);
  const spaces = [];
  for (let index = 0; index < repeatNum; index++) {
    spaces.push(realSpace * scale * index);
  }
  return spaces;
}

/**
 * 角度转弧度
 * @param {*} angle 
 * @returns 
 */
export function angle2Radian(angle) {
  //弧度 = π / 180 * 角度
  return (Math.PI / 180) * angle;
}

/**
 * 弧度转角度
 * @param {*} radian 
 * @returns 
 */
export function radian2Angle(radian) {
  //角度 = 180 / π * 弧度
  return (180 / Math.PI) * radian;
}

/**
 * 斜率转弧度
 * @param {*} slope 
 * @returns 
 */
export function slope2Radian(slope) {
  return Math.atan(slope);
}

/**
 * 斜率转角度
 * @param {*} slope 
 * @returns 
 */
export function slope2Angle(slope) {
  return radian2Angle(slope2Radian(slope));
}
