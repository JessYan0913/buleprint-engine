import { select } from "d3-selection";
import Blueprint from ".";
import Point, { slope2Angle } from "./utils/geometry";

let arrowSize = 16;

const Arrow = function Arrow(_blueprint, props = {}) {
  if (!(_blueprint instanceof Blueprint)) {
    new Error("_blueprint must is Blueprint ");
  }

  if (_blueprint.markerContainer === void 0) {
    new Error("markerContainer cannot is undefined ");
  }

  this.$blueprint = _blueprint;

  this.size = props.size || 16;
  arrowSize = this.size;
  this.defs = this.$blueprint.markerContainer.append("defs");

  this.defArrow.call(this, Arrow.startArrow);
  this.defArrow.call(this, Arrow.endArrow);
};

Arrow.prototype.defArrow = function defArrow({ id, path, refX, refY }) {
  this.defs
    .append("marker")
    .attr("id", id)
    .attr("markerUnits", "strokeWidth")
    .attr("markerWidth", this.size * 4)
    .attr("markerHeight", this.size)
    .attr("viewBox", "0 0 24 24")
    .attr("refX", refX)
    .attr("refY", refY)
    .attr("orient", "auto")
    .append("path")
    .attr("d", path)
    .attr("fill", "#000");
};

Arrow.startArrow = {
  id: "markerStartArrow",
  path: "M24,2 L2,5 L24,8 L20,5 Z",
  refX: 4,
  refY: 5,
};

Arrow.endArrow = {
  id: "markerEndArrow",
  path: "M2,2 L24,5 L2,8 L6,5 Z",
  refX: 22,
  refY: 5,
};

const Marker = function Marker(props = {}) {
  this.name = props.name;
  this.start = props.start || {};
  this.end = props.end || {};
  this.height = props.height || 20;
  this.scale = props.scale;
  this.container = props.container;

  //将真实的坐标转换为屏幕上的坐标
  this.startX = this.start.x * this.scale;
  this.startY = this.start.y * this.scale;
  this.endX = this.end.x * this.scale;
  this.endY = this.end.y * this.scale;

  const _start = props.start || {};
  const _end = props.end || {};
  this.realStart = new Point(_start.x, _start.y);
  this.realEnd = new Point(_end.x, _end.y);

  this.start = new Point(this.realStart.x * this.scale, this.realStart.y * this.scale);
  this.end = new Point(this.realEnd.x * this.scale, this.realEnd.y * this.scale);

  //尺寸线高度
  this.sizeLineHeight = this.height > 0 ? this.height - 4 : this.height + 4;

  this.sizeLineGroup = this.container.append("g");
  this.textSelection = this.sizeLineGroup
    .append("text")
    .attr("font-family", "Verdana")
    .attr("startOffset", "50%")
    .attr("font-size", 12);
};

const AlignMarker = function AlignMarker(props = {}) {
  Object.getPrototypeOf(AlignMarker).call(this, props);

  const { text } = props;

  //标注文本，如果没有传入则计算标注两点间的距离
  this.text = text || this.realStart.distance(this.realEnd).toFixed(2);

  //计算尺寸线的斜率
  this.alignMarkerSlope = this.end.linearSlope(this.start);

  //标注线长度
  this.sizeLineLength = this.start.distance(this.end);

  this.textSelectionSize = {
    width: this.textSelection.node().getBBox().width,
    height: this.textSelection.node().getBBox().width,
  };

  //是否采用小尺寸标注，如果文本长度 + 两个箭头的长度 + 10 < 尺寸线长度，则使用正常尺寸线标记；否则使用小尺寸线标注
  this.isNormalSizeMarker = this.textSelectionSize.width + (arrowSize + 5) * 2 < this.sizeLineLength;
};

AlignMarker.prototype = Object.create(Marker.prototype);
AlignMarker.prototype.constructor = AlignMarker;
Object.setPrototypeOf(AlignMarker, Marker);

AlignMarker.prototype.render = function render() {
  alignExtensionLine(this.container, this.start, this.end, this.height);

  const sizeStartPoint = this.start.linearDistancePoint(-1 / this.alignMarkerSlope, this.sizeLineHeight);

  const sizeEndPoint = this.end.linearDistancePoint(-1 / this.alignMarkerSlope, this.sizeLineHeight);

  if (this.isNormalSizeMarker) {
    drawingNormalSizeLine(this.sizeLineGroup, sizeStartPoint, sizeEndPoint, this.alignMarkerSlope, this.text);
  } else {
    drawingSmallSizeLine(this.sizeLineGroup, sizeStartPoint, sizeEndPoint, this.alignMarkerSlope, this.text);
  }
};

const LinearMarker = function LinearMarker(props = {}) {
  Object.getPrototypeOf(LinearMarker).call(this, props);

  let { direction = "x", text } = props;
  direction = direction.toLowerCase();
  if (direction === "y" && this.start.x === this.end.x) {
    throw new Error(`标记从(${this.start.x}, ${this.start.y}) 到 (${this.end.x}, ${this.end.y})无法在Y方向绘制`);
  }
  if (direction === "x" && this.start.y === this.end.y) {
    throw new Error(`标记从(${this.start.x}, ${this.start.y}) 到 (${this.end.x}, ${this.end.y})无法在X方向绘制`);
  }

  this.linearMarkerSlope = direction === "y" ? 0 : Infinity;

  this.sizeLineLength = direction === "y" ? Math.abs(this.start.x - this.end.x) : Math.abs(this.start.y - this.end.y);

  this.text =
    text ||
    (direction === "y"
      ? Math.abs(this.realStart.x - this.realEnd.x).toFixed(2)
      : Math.abs(this.realStart.y - this.realEnd.y).toFixed(2));

  this.textSelectionSize = {
    width: this.textSelection.node().getBBox().width,
    height: this.textSelection.node().getBBox().width,
  };

  this.isNormalSizeMarker = this.textSelectionSize.width + (arrowSize + 5) * 2 < this.sizeLineLength;

  this.direction = direction;
};

LinearMarker.prototype = Object.create(Marker.prototype);
LinearMarker.prototype.constructor = LinearMarker;
Object.setPrototypeOf(LinearMarker, Marker);

LinearMarker.prototype.render = function render() {
  const extensionPoint = linearExtensionLine(this.container, this.start, this.end, this.direction, this.height)

  const sizeStartPoint = extensionPoint(this.start, this.sizeLineHeight);
  const sizeEndPoint = extensionPoint(this.end, this.sizeLineHeight);

  if (this.isNormalSizeMarker) {
    drawingNormalSizeLine(this.sizeLineGroup, sizeStartPoint, sizeEndPoint, this.alignMarkerSlope, this.text);
  } else {
    drawingSmallSizeLine(this.sizeLineGroup, sizeStartPoint, sizeEndPoint, this.alignMarkerSlope, this.text);
  }
};

function drawingLine(container, point1, point2) {
  if (!(point1 instanceof Point) || !(point2 instanceof Point)) {
    throw new Error();
  }
  const line = container
    .append("line")
    .attr("x1", point1.x)
    .attr("y1", point1.y)
    .attr("x2", point2.x)
    .attr("y2", point2.y)
    .attr("stroke", "black");
  return line;
}

function drawingNormalSizeLine(container, point1, point2, slope, text) {
  if (!(point1 instanceof Point) || !(point2 instanceof Point)) {
    throw new Error();
  }
  if (slope === void 0) {
    slope = point1.linearSlope(point2);
  }

  drawingLine(container, point1, point2)
    .attr("marker-start", `url(#${Arrow.startArrow.id})`)
    .attr("marker-end", `url(#${Arrow.endArrow.id})`);

  const textPoint = point1.midpoint(point2);

  const sizeLineAngle = slope2Angle(slope);

  container
    .append("text")
    .attr("font-family", "Verdana")
    .attr("startOffset", "50%")
    .attr("font-size", 12)
    .attr(
      "transform",
      `translate(${textPoint.x},${textPoint.y}) 
      rotate(${sizeLineAngle > 0 ? sizeLineAngle + 180 : sizeLineAngle})`
    )
    .attr("text-anchor", "middle")
    .text(text);
}

function drawingSmallSizeLine(container, point1, point2, slope, text) {
  if (!(point1 instanceof Point) || !(point2 instanceof Point)) {
    throw new Error();
  }
  if (slope === void 0) {
    slope = point1.linearSlope(point2);
  }
  const point1End = point1.linearDistancePoint(slope, -16 * 2);
  drawingLine(container, point1, point1End).attr("marker-start", `url(#${Arrow.startArrow.id})`);

  const point2End = point2.linearDistancePoint(slope, 16 * 2);
  drawingLine(container, point2, point2End).attr("marker-start", `url(#${Arrow.startArrow.id})`);

  let textPoint = new Point();

  const sizeLineAngle = slope2Angle(slope);
  if (sizeLineAngle < 0) {
    textPoint = point1.midpoint(point1End);
  } else {
    textPoint = point2.midpoint(point2End);
  }

  container
    .append("text")
    .attr("font-family", "Verdana")
    .attr("startOffset", "50%")
    .attr("font-size", 12)
    .attr(
      "transform",
      `translate(${textPoint.x},${textPoint.y}) rotate(${sizeLineAngle < 0 ? sizeLineAngle + 360 : sizeLineAngle})`
    )
    .text(text);
}

function alignExtensionLine(container, point1, point2, height) {
  if (!(container.constructor.name === select().constructor.name)) {
    throw new Error();
  }
  if (!(point1 instanceof Point) || !(point2 instanceof Point)) {
    throw new Error();
  }
  const alignMarkerSlope = point2.linearSlope(point1);
  const slope = -1 / alignMarkerSlope;
  const extensionLineGroup = container.append("g");
  const point1End = point1.linearDistancePoint(slope, height);
  drawingLine(extensionLineGroup, point1, point1End);

  const point2End = point2.linearDistancePoint(slope, height);
  drawingLine(extensionLineGroup, point2, point2End);
}

function linearExtensionLine(container, point1, point2, direction, height) {
  if (!(point1 instanceof Point) || !(point2 instanceof Point)) {
    throw new Error();
  }
  const maxX = Math.max(point1.x, point2.x);
  const minX = Math.min(point1.x, point2.x);
  const maxY = Math.max(point1.y, point2.y);
  const minY = Math.min(point1.y, point2.y);
  const extersionPoint = {
    x: (point, h) => {
      if (!(point instanceof Point)) {
        throw new Error();
      }
      return new Point(h < 0 ? minX + h : maxX + h, point.y);
    },
    y: (point, h) => {
      if (!(point instanceof Point)) {
        throw new Error();
      }
      return new Point(point.x, h < 0 ? minY + h : maxY + h);
    },
  };
  const point1End = extersionPoint[direction](point1, height);
  drawingLine(container, point1, point1End);
  
  const point2End = extersionPoint[direction](point2, height);
  drawingLine(container, point2, point2End);

  return extersionPoint[direction];
}

export { Arrow, AlignMarker, LinearMarker };
