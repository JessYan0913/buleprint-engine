import { assertTypes } from "./assert";

const Point = function Point(x = 0, y = 0) {
  assertTypes.numberAssert("x", x);
  assertTypes.numberAssert("y", y);

  this.x = x;
  this.y = y;
};

export default Point;

Point.prototype.linearSlope = function linearSlope(targetPoint) {
  assertTypes.pointAssert("targetPoint", targetPoint);

  return (targetPoint.y - this.y) / (targetPoint.x - this.x);
};

Point.prototype.distance = function distance(targetPoint) {
  assertTypes.pointAssert("targetPoint", targetPoint);

  return Math.sqrt(Math.pow(this.x - targetPoint.x, 2) + Math.pow(this.y - targetPoint.y, 2));
};

Point.prototype.linearDistancePoint = function linearDistancePoint(slope, h) {
  assertTypes.numberAssert("slope", slope);
  assertTypes.numberAssert("h", h);

  const p = Math.sqrt(1 + slope * slope);
  const x = h / p + this.x;
  const y = isNaN((slope * h) / p) ? this.y + h : (slope * h) / p + this.y;
  return new Point(x, y);
};

Point.prototype.midpoint = function midpoint(targetPoint) {
  assertTypes.pointAssert("targetPoint", targetPoint);

  const x = (this.x + targetPoint.x) / 2;
  const y = (this.y + targetPoint.y) / 2;
  return new Point(x, y);
};

/**
 * 角度转弧度
 * @param {*} angle
 * @returns
 */
export function angle2Radian(angle) {
  assertTypes.numberAssert("angle", angle);
  //弧度 = π / 180 * 角度
  return (Math.PI / 180) * angle;
}

/**
 * 弧度转角度
 * @param {*} radian
 * @returns
 */
export function radian2Angle(radian) {
  assertTypes.numberAssert("radian", radian);
  //角度 = 180 / π * 弧度
  return (180 / Math.PI) * radian;
}

/**
 * 斜率转弧度
 * @param {*} slope
 * @returns
 */
export function slope2Radian(slope) {
  assertTypes.numberAssert("slope", slope);
  return Math.atan(slope);
}

/**
 * 斜率转角度
 * @param {*} slope
 * @returns
 */
export function slope2Angle(slope) {
  assertTypes.numberAssert("slope", slope);
  return radian2Angle(slope2Radian(slope));
}
