import { linearSlope, linearDistancePoint } from "./utils/math-util";

const ArrowType = {
  //线条开始处的箭头，对应 marker-start 属性
  start: {
    id: "markerStartArrow",
    path: "M24,2 L2,5 L24,8 L20,5 Z",
    refX: 6,
    refY: 5,
  },
  //线条结束处的箭头，对应 marker-end 属性
  end: {
    id: "markerEndArrow",
    path: "M2,2 L24,5 L2,8 L6,5 Z",
    refX: 6,
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
    .attr("viewBox", "0 0 12 12")
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
      repeat = false,
      scale,
      container,
    } = props;
    this.name = name;
    this.sizeNum = sizeNum;
    this.repeat = repeat;
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

  extensionLine() {
    const extensionLineGroup = this.container.append("g");
    extensionLineGroup.append("line");
  }

  render() {
    const arrowGroup = this.container.append("g");

    const targetPoint1 = linearDistancePoint(
      -1 / this.markerSlope,
      this.endX,
      this.endY,
      1000 * this.scale
    );
    arrowGroup
      .append("line")
      .attr("x1", this.endX)
      .attr("y1", this.endY)
      .attr("x2", targetPoint1[0])
      .attr("y2", targetPoint1[1])
      .attr("stroke", "red");
    // .attr("marker-end", `url(#${this.endArrowId})`);

    const targetPoint = linearDistancePoint(
      -1 / this.markerSlope,
      this.startX,
      this.startY,
      1000 * this.scale
    );
    arrowGroup
      .append("line")
      .attr("x1", this.startX)
      .attr("y1", this.startY)
      .attr("x2", targetPoint[0])
      .attr("y2", targetPoint[1])
      .attr("stroke", "red");
    // .attr("marker-end", `url(#${this.endArrowId})`);
  }
}

export default Marker;
