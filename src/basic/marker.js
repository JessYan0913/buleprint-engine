import {
  midpoint,
  linearSlope,
  linearDistancePoint,
  twoPointsDistance,
  slope2Angle,
} from "./utils/math-util";

const MarkerPosition = {
  inner: ({ slope, x, y, h }) => linearDistancePoint(slope, x, y, h),
  outer: ({ slope, x, y, h }) => linearDistancePoint(slope, x, y, -h),
};

const ArrowType = {
  //线条开始处的箭头，对应 marker-start 属性
  start: {
    id: "markerStartArrow",
    path: "M24,2 L2,5 L24,8 L20,5 Z",
    refX: 4,
    refY: 5,
  },
  //线条结束处的箭头，对应 marker-end 属性
  end: {
    id: "markerEndArrow",
    path: "M2,2 L24,5 L2,8 L6,5 Z",
    refX: 22,
    refY: 5,
  },
};

let arrowSize = 16;

/**
 * 定义箭头
 * @param {*} props
 */
function defMarkerArrow(props) {
  const { container, size = arrowSize } = props;
  arrowSize = size;
  const defs = container.append("defs");

  for (const key in ArrowType) {
    if (Object.hasOwnProperty.call(ArrowType, key)) {
      const { id, path, refX, refY } = ArrowType[key];
      defs
        .append("marker")
        .attr("id", id)
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", size * 4)
        .attr("markerHeight", size)
        .attr("viewBox", "0 0 24 24")
        .attr("refX", refX)
        .attr("refY", refY)
        .attr("orient", "auto")
        .append("path")
        .attr("d", path)
        .attr("fill", "#000");
    }
  }
}

class Marker {
  /**
   * 三视图的标记
   * @param {*} props
   */
  constructor(props) {
    const {
      name,
      text,
      start = {},
      end = {},
      height = 20,
      position = "outer",
      repaetX = {},
      repaetY = {},
      scale,
      container,
    } = props;
    this.name = name;
    //TODO: 高度可以通过代码计算是否需要抬高，例如：记录同一斜率和同一高度的标记是否已经存在，如果已经存在，则*2
    //TODO: 判断两条线段是否在同一直线上，并判断两条直线是否重叠
    this.height = height;
    this.position = MarkerPosition[position];
    this.repeatX = repaetX;
    this.repeatY = repaetY;
    this.scale = scale;
    this.container = container;

    //将真实的坐标转换为屏幕上的坐标
    this.startX = start.x * scale;
    this.startY = start.y * scale;
    this.endX = end.x * scale;
    this.endY = end.y * scale;

    this.text = text || twoPointsDistance(start.x, start.y, end.x, end.y);

    //计算尺寸线的斜率
    this.markerSlope = linearSlope(
      this.endX,
      this.endY,
      this.startX,
      this.startY
    );

    //尺寸线到尺寸界线顶点的距离
    this.sizeLineToExtensionLineTop = 4;
  }

  /**
   * 计算过点 (x,y) 与 尺寸线垂直的直线上，距离 h 的点的坐标
   * 理论上存在两个这样的对称点，根据参数 position 决定取哪个点
   * @param {*} x
   * @param {*} y
   * @param {*} h
   * @returns
   */
  calculateTargetPoint(x, y, h = this.height) {
    return this.position({
      slope: -1 / this.markerSlope,
      h: h,
      x,
      y,
    });
  }

  /**
   * 绘制一条直线
   * @param {*} container
   * @param {*} x1
   * @param {*} y1
   * @param {*} x2
   * @param {*} y2
   * @returns
   */
  drawingLine(container, x1, y1, x2, y2) {
    const line = container
      .append("line")
      .attr("x1", x1)
      .attr("y1", y1)
      .attr("x2", x2)
      .attr("y2", y2)
      .attr("stroke", "black");
    return line;
  }

  /**
   * 绘制尺寸界线
   */
  drawingLengthBoundaryLine() {
    //绘制尺寸界线
    const extensionLineGroup = this.container.append("g");
    //以标记起点为起始尺寸界线的起点，计算起始尺寸界线的终点
    const extensionStartPoint = this.calculateTargetPoint(
      this.startX,
      this.startY
    );
    this.drawingLine(
      extensionLineGroup,
      this.startX,
      this.startY,
      extensionStartPoint.x,
      extensionStartPoint.y
    );
    //以标记终点为终点尺寸界线的起点，计算终点尺寸界线的终点
    const extensionEndPoint = this.calculateTargetPoint(this.endX, this.endY);
    this.drawingLine(
      extensionLineGroup,
      this.endX,
      this.endY,
      extensionEndPoint.x,
      extensionEndPoint.y
    );
  }
}

class AlignMarker extends Marker {
  /**
   * 对齐标注
   * 可用于标注：对齐的长度，例如：长度、宽度、高度、弦长等
   * @param {*} props
   */
  constructor(props) {
    super(props);
    this.sizeLineGroup = this.container.append("g");
    this.textSelection = this.sizeLineGroup
      .append("text")
      .attr("font-family", "Verdana")
      .attr("startOffset", "50%")
      .attr("font-size", 12)
      .text(this.text);
    this.textSelectionSize = {
      width: this.textSelection.node().getBBox().width,
      height: this.textSelection.node().getBBox().width,
    };
    this.sizeLineLength = twoPointsDistance(
      this.startX,
      this.startY,
      this.endX,
      this.endY
    );
  }

  /**
   * 正常的对齐标注
   */
  normalAlignMarker() {
    //计算尺寸线起点
    const sizeStartPoint = this.calculateTargetPoint(
      this.startX,
      this.startY,
      this.height - this.sizeLineToExtensionLineTop
    );
    //计算尺寸线终点
    const sizeEndPoint = this.calculateTargetPoint(
      this.endX,
      this.endY,
      this.height - this.sizeLineToExtensionLineTop
    );

    //绘制尺寸线
    this.drawingLine(
      this.sizeLineGroup,
      sizeStartPoint.x,
      sizeStartPoint.y,
      sizeEndPoint.x,
      sizeEndPoint.y
    )
      .attr("marker-start", `url(#${ArrowType.start.id})`)
      .attr("marker-end", `url(#${ArrowType.end.id})`);

    //计算文本坐标
    const textPoint = midpoint(
      sizeStartPoint.x,
      sizeStartPoint.y,
      sizeEndPoint.x,
      sizeEndPoint.y
    );
    //计算尺寸线与X的夹脚
    const sizeLineAngle = slope2Angle(this.markerSlope);
    //绘制尺寸文本
    this.textSelection
      .attr(
        "transform",
        `translate(${textPoint.x},${textPoint.y}) rotate(${
          sizeLineAngle > 0 ? sizeLineAngle + 180 : sizeLineAngle
        })`
      )
      .attr("text-anchor", "middle");
  }

  /**
   * 小尺寸的对齐标注
   */
  smallAlignMarker() {
    //计算尺寸线1的起点
    const size1StartPoint = this.calculateTargetPoint(
      this.startX,
      this.startY,
      this.height - this.sizeLineToExtensionLineTop
    );
    //计算尺寸线1的终点
    const size1EndPoint = linearDistancePoint(
      this.markerSlope,
      size1StartPoint.x,
      size1StartPoint.y,
      -16 * 2
    );
    this.drawingLine(
      this.sizeLineGroup,
      size1StartPoint.x,
      size1StartPoint.y,
      size1EndPoint.x,
      size1EndPoint.y
    ).attr("marker-start", `url(#${ArrowType.start.id})`);
    //计算尺寸线2的起点
    const size2StartPoint = this.calculateTargetPoint(
      this.endX,
      this.endY,
      this.height - this.sizeLineToExtensionLineTop
    );
    //计算尺寸线2的终点
    const size2EndPoint = linearDistancePoint(
      this.markerSlope,
      size2StartPoint.x,
      size2StartPoint.y,
      16 * 2
    );
    this.drawingLine(
      this.sizeLineGroup,
      size2StartPoint.x,
      size2StartPoint.y,
      size2EndPoint.x,
      size2EndPoint.y
    ).attr("marker-start", `url(#${ArrowType.start.id})`);

    let textPoint = {
      x: 0,
      y: 0,
    };

    //计算尺寸线与X的夹脚
    const sizeLineAngle = slope2Angle(this.markerSlope);
    if (this.position === "inner" || sizeLineAngle < 0) {
      textPoint = midpoint(
        size1StartPoint.x,
        size1StartPoint.y,
        size1EndPoint.x,
        size1EndPoint.y
      );
    } else {
      textPoint = midpoint(
        size2StartPoint.x,
        size2StartPoint.y,
        size2EndPoint.x,
        size2EndPoint.y
      );
    }

    this.textSelection.attr(
      "transform",
      `translate(${textPoint.x},${textPoint.y}) rotate(${
        sizeLineAngle < 0 ? sizeLineAngle + 360 : sizeLineAngle
      })`
    );
  }

  /**
   * 绘制对齐标注
   */
  render() {
    //绘制长度尺寸界线
    this.drawingLengthBoundaryLine();
    //如果文本长度 + 两个箭头的长度 + 10 < 尺寸线长度，则使用正常尺寸线标记；否则使用小尺寸线标注
    if (
      this.textSelectionSize.width + (arrowSize + 5) * 2 <
      this.sizeLineLength
    ) {
      this.normalAlignMarker();
    } else {
      this.smallAlignMarker();
    }
  }
}

export { defMarkerArrow, AlignMarker };
