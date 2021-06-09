import { select } from "d3-selection";
import assert, { assertTypes } from "./utils/assert";
import Point, { slope2Angle } from "./utils/geometry";

let arrowSize = 16;

const Arrow = function Arrow(_blueprint, props = {}) {
  assertTypes.blueprintAssert("_blueprint", _blueprint);
  assert(_blueprint.markerContainer !== void 0, " markerContainer cannot is undefined");

  this.$blueprint = _blueprint;

  this.size = props.size || 16;
  arrowSize = this.size;
  this.defs = this.$blueprint.markerContainer.append("defs");

  this.defArrow(Arrow.startArrow);
  this.defArrow(Arrow.endArrow);
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

export { Arrow };

const BaseMarker = function BaseMarker(_blueprint, props = {}) {
  this.$blueprint = _blueprint;

  this.type = props.type;
  this.name = props.name;
  this.height = props.height || 20;
  this.container = this.$blueprint.markerContainer;

  const _start = props.start || {};
  const _end = props.end || {};
  this.realStart = new Point(_start.x, _start.y);
  this.realEnd = new Point(_end.x, _end.y);

  const _scale = this.$blueprint.scale;
  this.start = new Point(this.realStart.x * _scale, this.realStart.y * _scale);
  this.end = new Point(this.realEnd.x * _scale, this.realEnd.y * _scale);

  if (props.formatter !== void 0) {
    assertTypes.functionAssert("formatter", props.formatter);
    this.formatter = props.formatter;
  }

  this.sizeLineHeight = this.height > 0 ? this.height - 4 : this.height + 4;

  this.sizeLineGroup = this.container.append("g");
};

BaseMarker.prototype.calculateTextSize = function calculateTextSize(text) {
  const textSelection = this.sizeLineGroup
    .append("text")
    .attr("font-family", "Verdana")
    .attr("startOffset", "50%")
    .attr("font-size", 12)
    .text(text);

  const textSelectionSize = {
    width: textSelection.node().getBBox().width,
    height: textSelection.node().getBBox().width,
  };
  textSelection.remove();
  return textSelectionSize;
};

const AlignMarker = function AlignMarker(_blueprint, props = {}) {
  Object.getPrototypeOf(AlignMarker).call(this, _blueprint, props);

  this.text = this.realStart.distance(this.realEnd);

  if (this.formatter) {
    this.text = this.formatter(this.text, this.realStart, this.realEnd);
  }

  this.alignMarkerSlope = this.end.linearSlope(this.start);

  this.sizeLineLength = this.start.distance(this.end);

  const textSelectionSize = this.calculateTextSize(this.text);

  // 是否采用小尺寸标注，如果文本长度 + 两个箭头的长度 + 10 < 尺寸线长度，则使用正常尺寸线标记；否则使用小尺寸线标注
  this.isNormalSizeMarker = textSelectionSize.width + (arrowSize + 5) * 2 < this.sizeLineLength;
};

AlignMarker.prototype = Object.create(BaseMarker.prototype);
AlignMarker.prototype.constructor = AlignMarker;
Object.setPrototypeOf(AlignMarker, BaseMarker);

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

const LinearDirection = {
  x: "x",
  y: "y",
};

const LinearMarker = function LinearMarker(_blueprint, props = {}) {
  Object.getPrototypeOf(LinearMarker).call(this, _blueprint, props);

  let { direction = LinearDirection.x } = props;
  direction = direction.toLowerCase();
  if (direction === LinearDirection.y && this.start.x === this.end.x) {
    throw new Error(
      `from (${this.start.x}, ${this.start.y}) to (${this.end.x}, ${this.end.y}) cannot be the original size in the Y direction`
    );
  }
  if (direction === LinearDirection.x && this.start.y === this.end.y) {
    throw new Error(
      `from (${this.start.x}, ${this.start.y}) to (${this.end.x}, ${this.end.y}) cannot be the original size in the X direction`
    );
  }

  this.linearMarkerSlope = direction === LinearDirection.y ? 0 : Infinity;

  this.sizeLineLength =
    direction === LinearDirection.y ? Math.abs(this.start.x - this.end.x) : Math.abs(this.start.y - this.end.y);

  this.text =
    direction === LinearDirection.y
      ? Math.abs(this.realStart.x - this.realEnd.x)
      : Math.abs(this.realStart.y - this.realEnd.y);

  if (this.formatter) {
    this.text = this.formatter(this.text, this.realStart, this.realEnd);
  }

  const textSelectionSize = this.calculateTextSize(this.text);

  this.isNormalSizeMarker = textSelectionSize.width + (arrowSize + 5) * 2 < this.sizeLineLength;

  this.direction = direction;
};

LinearMarker.prototype = Object.create(BaseMarker.prototype);
LinearMarker.prototype.constructor = LinearMarker;
Object.setPrototypeOf(LinearMarker, BaseMarker);

LinearMarker.prototype.render = function render() {
  const extensionPoint = linearExtensionLine(this.container, this.start, this.end, this.direction, this.height);

  const sizeStartPoint = extensionPoint(this.start, this.sizeLineHeight);
  const sizeEndPoint = extensionPoint(this.end, this.sizeLineHeight);

  if (this.isNormalSizeMarker) {
    drawingNormalSizeLine(this.sizeLineGroup, sizeStartPoint, sizeEndPoint, this.alignMarkerSlope, this.text);
  } else {
    drawingSmallSizeLine(this.sizeLineGroup, sizeStartPoint, sizeEndPoint, this.alignMarkerSlope, this.text);
  }
};

function drawingLine(container, point1, point2) {
  assertTypes.pointAssert("point1", point1);
  assertTypes.pointAssert("point2", point2);

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
  assertTypes.pointAssert("point1", point1);
  assertTypes.pointAssert("point2", point2);

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
  assertTypes.pointAssert("point1", point1);
  assertTypes.pointAssert("point2", point2);

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
  assert(container.constructor.name === select().constructor.name, " container must is D3js.Selection");

  assertTypes.pointAssert("point1", point1);
  assertTypes.pointAssert("point2", point2);

  const alignMarkerSlope = point2.linearSlope(point1);
  const slope = -1 / alignMarkerSlope;
  const extensionLineGroup = container.append("g");
  const point1End = point1.linearDistancePoint(slope, height);
  drawingLine(extensionLineGroup, point1, point1End);

  const point2End = point2.linearDistancePoint(slope, height);
  drawingLine(extensionLineGroup, point2, point2End);
}

function linearExtensionLine(container, point1, point2, direction, height) {
  assertTypes.pointAssert("point1", point1);
  assertTypes.pointAssert("point2", point2);

  const maxX = Math.max(point1.x, point2.x);
  const minX = Math.min(point1.x, point2.x);
  const maxY = Math.max(point1.y, point2.y);
  const minY = Math.min(point1.y, point2.y);
  const extersionPoint = {
    [LinearDirection.x]: (point, h) => {
      if (!(point instanceof Point)) {
        throw new Error();
      }
      return new Point(h < 0 ? minX + h : maxX + h, point.y);
    },
    [LinearDirection.y]: (point, h) => {
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

const Marker = function(_blueprint, props = {}) {
  assertTypes.blueprintAssert("_blueprint", _blueprint);

  const Markers = {
    align: AlignMarker,
    linear: LinearMarker,
  };

  const type = props.type;
  return new (Markers[type] || Markers.align)(_blueprint, props);
};

export default Marker;
