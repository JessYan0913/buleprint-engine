const Point = function Point(x = 0, y = 0) {
  this.x = x;
  this.y = y;
};

export default Point;

Point.prototype.linearSlope = function linearSlope(targetPoint) {
  if (!(targetPoint instanceof Point)) {
    new Error("不是一个点");
  }

  return (targetPoint.y - this.y) / (targetPoint.x - this.x);
};

Point.prototype.distance = function distance(targetPoint) {
  if (!(targetPoint instanceof Point)) {
    throw new Error("不是一个点");
  }

  return Math.sqrt(Math.pow(this.x - targetPoint.x, 2) + Math.pow(this.y - targetPoint.y, 2));
};

Point.prototype.linearDistancePoint = function linearDistancePoint(slope, h) {
  const p = Math.sqrt(1 + slope * slope);
  const x = h / p + this.x;
  const y = isNaN((slope * h) / p) ? this.y + h : (slope * h) / p + this.y;
  return new Point(x, y);
};

Point.prototype.midpoint = function midpoint(targetPoint) {
  if (!(targetPoint instanceof Point)) {
    throw new Error("不是一个点");
  }
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
