import { linearSlope, linearDistancePoint, midpoint } from "./utils/math-util";

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

/**
 * 绘制箭头
 * @param {*} props
 */
function arrow(props) {
  const { selection, size, type = ArrowType.end } = props;
  const { id, path, refX, refY } = type;
  const defs = selection.append("defs");
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

class Marker {
  /**
   * 三视图的标记
   * @param {*} props
   */
  constructor(props) {
    const {
      name,
      sizeNum,
      start = {},
      end = {},
      position = "outer",
      scale,
      container,
    } = props;
    this.name = name;
    this.sizeNum = sizeNum;
    this.position = MarkerPosition[position];
    this.scale = scale;
    this.container = container;

    //将真实的坐标转换为屏幕上的坐标
    this.startX = start.x * scale;
    this.startY = start.y * scale;
    this.endX = end.x * scale;
    this.endY = end.y * scale;

    this.markerSlope = linearSlope(
      this.startX,
      this.startY,
      this.endX,
      this.endY
    );
  }

  static generateArrow(container) {
    const arrowConfig = {
      selection: container,
      size: 12,
    };
    arrow({
      ...arrowConfig,
      type: ArrowType.end,
    });
    arrow({
      ...arrowConfig,
      type: ArrowType.start,
    });
  }

  calculateTargetPoint(x, y, h = 500) {
    return this.position({
      slope: -1 / this.markerSlope,
      h: h * this.scale,
      x,
      y,
    });
  }

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

  render() {
    //绘制界线
    const extensionLineGroup = this.container.append("g");
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
    const extensionEndPoint = this.calculateTargetPoint(this.endX, this.endY);
    this.drawingLine(
      extensionLineGroup,
      this.endX,
      this.endY,
      extensionEndPoint.x,
      extensionEndPoint.y
    );

    const sizeLineGroup = this.container.append("g");
    const arrowStartPoint = this.calculateTargetPoint(
      this.startX,
      this.startY,
      450
    );
    const arrowEndPoint = this.calculateTargetPoint(this.endX, this.endY, 450);
    this.drawingLine(
      sizeLineGroup,
      arrowStartPoint.x,
      arrowStartPoint.y,
      arrowEndPoint.x,
      arrowEndPoint.y
    )
      .attr("marker-start", `url(#${ArrowType.start.id})`)
      .attr("marker-end", `url(#${ArrowType.end.id})`);
    const arrowMidpoint = midpoint(
      arrowStartPoint.x,
      arrowStartPoint.y,
      arrowEndPoint.x,
      arrowEndPoint.y
    );
    sizeLineGroup
      .append("text")
      .attr("x", arrowMidpoint.x)
      .attr("y", arrowMidpoint.y)
      .attr("text-anchor", "middle")
      // .attr('transform', `rotate(270, ${arrowMidpoint.x + (17.8125/4)} ${arrowMidpoint.y + (18.015625/4)})`)
      .text("dd");
  }
}

export default Marker;
