import {
  linearSlope,
  linearDistancePoint,
  twoPointsDistance,
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

/**
 * 定义箭头
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
      text,
      start = {},
      end = {},
      height = 500,
      position = "outer",
      repaetX = {},
      repaetY = {},
      scale,
      container,
    } = props;
    this.name = name;
    //TODO: 高度可以通过代码计算是否需要抬高，例如：记录同一斜率和同一高度的标记是否已经存在，如果已经存在，则*2
    this.height = Math.max(height, 500);
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

    this.markerDistance = twoPointsDistance(start.x, start.y, end.x, end.y);

    this.text = text || this.markerDistance;

    //计算尺寸线的斜率
    this.markerSlope = linearSlope(
      this.startX,
      this.startY,
      this.endX,
      this.endY
    );
  }

  /**
   * 添加箭头到容器，以备绘图使用
   * @param {*} container
   */
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
      h: h * this.scale,
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
   * 绘制尺寸标注
   */
  render() {
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

    //绘制尺寸线
    const sizeLineGroup = this.container.append("g");
    //计算尺寸线起点
    const sizeStartPoint = this.calculateTargetPoint(
      this.startX,
      this.startY,
      this.height - 100
    );
    //计算尺寸线终点
    const sizeEndPoint = this.calculateTargetPoint(
      this.endX,
      this.endY,
      this.height - 100
    );

    //定义尺寸线
    const sizeLineDefs = sizeLineGroup.append("defs");
    sizeLineDefs
      .append("path")
      .attr("id", this.name)
      .attr(
        "d",
        `M ${sizeEndPoint.x} ${sizeEndPoint.y} L ${sizeStartPoint.x} ${sizeStartPoint.y}`
      );
    //绘制尺寸线
    sizeLineGroup
      .append("use")
      .attr("xlink:href", `#${this.name}`)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("marker-start", `url(#${ArrowType.start.id})`)
      .attr("marker-end", `url(#${ArrowType.end.id})`);
    //绘制尺寸文本
    sizeLineGroup
      .append("text")
      .attr("font-family", "Verdana")
      .append("textPath")
      .attr("xlink:href", `#${this.name}`)
      .attr("text-anchor", "middle")
      .attr("startOffset", "50%")
      .attr("font-size", 12)
      .text(this.text);
  }
}

export default Marker;
