import { linearSlope, linearDistancePoint } from "./utils/math-util";

const ArrowType = {
  start: {
    path: "M24,2 L2,5 L24,8 L20,5 Z",
    refX: 6,
    refY: 5,
  },
  end: {
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
  const { id, selection, size, type = ArrowType.end } = props;
  const { path, refX, refY } = type;
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
  constructor(props) {
    const { svg, sizeNum, start = {}, end = {}, repeat = false, scale } = props;
    this.svg = svg;
    this.sizeNum = sizeNum;
    this.startX = +start.x;
    this.startY = +start.y;
    this.endX = +end.x;
    this.endY = +end.y;
    this.repeat = repeat;
    this.scale = scale;
    this.container = this.svg.append("g");

    this.startArrowId = "markerStartArrow";
    this.endArrowId = "markerEndArrow";
    const arrowConfig = {
      selection: this.container,
      size: 12,
    };
    arrow({
      ...arrowConfig,
      id: this.endArrowId,
      type: ArrowType.end,
    });
    arrow({
      ...arrowConfig,
      id: this.startArrowId,
      type: ArrowType.start,
    });

    this.markerSlope = linearSlope(
      this.startX,
      this.startY,
      this.endX,
      this.endY
    );
  }

  extensionLine() {
    const extensionLineGroup = this.container.append("g");
    extensionLineGroup.append("line");
  }

  render() {
    const arrowGroup = this.container.append("g");
    arrowGroup.attr("transform", "translate(100 100)");

    // arrowGroup
    //   .append("line")
    //   .attr("x1", this.startX)
    //   .attr("y1", this.startY)
    //   .attr("x2", this.endX)
    //   .attr("y2", this.endY)
    //   .attr("stroke", "green");

    const targetPoint1 = linearDistancePoint(
      -1 / this.markerSlope,
      this.endX,
      this.endY,
      -50,
    );
    arrowGroup
      .append("line")
      .attr("x1", this.endX)
      .attr("y1", this.endY)
      .attr("x2", targetPoint1[0])
      .attr("y2", targetPoint1[1])
      .attr("stroke", "red")
      // .attr("marker-end", `url(#${this.endArrowId})`);

    const targetPoint = linearDistancePoint(
      -1 / this.markerSlope,
      this.startX,
      this.startY,
      -50
    );
    arrowGroup
      .append("line")
      .attr("x1", this.startX)
      .attr("y1", this.startY)
      .attr("x2", targetPoint[0])
      .attr("y2", targetPoint[1])
      .attr("stroke", "red")
      // .attr("marker-end", `url(#${this.endArrowId})`);
  }
}

export default Marker;
