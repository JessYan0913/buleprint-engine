import "../assets";
import { max, min } from "d3-array";
import { select } from "d3-selection";
import { mergeArray } from "./utils/array-util";
import Marker from "./marker";
import Part from "./part";

class Blueprint {
  /**
   * 生成平面图
   * @param {*} props
   */
  constructor(props) {
    const {
      container,
      width,
      height,
      margin = { top: 40, left: 40, bottom: 40, right: 40 },
      realWidth,
      realHeight,
      parts = [],
      markers = [],
    } = props;
    this.container = container;
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.realWidth = realWidth;
    this.realHeight = realHeight;
    this.parts = parts;
    this.markers = markers;

    this.svg = select(container)
      .append("svg")
      .attr("style", "background: lightgrey")
      .attr("width", width)
      .attr("height", height);

    this.innerWidth = width - margin.left - margin.right;
    this.innerHeight = height - margin.top - margin.bottom;

    this.container = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    const widths = mergeArray(
      parts.map((item) => item.width),
      [realWidth]
    );
    const heights = mergeArray(
      parts.map((item) => item.height),
      [realHeight]
    );

    const maxrealWidth = max(widths);
    const maxrealHeight = max(heights);
    this.scale = min([
      this.innerWidth / maxrealWidth,
      this.innerHeight / maxrealHeight,
    ]);
  }

  /**
   * 绘制组件到视图中
   * @param {*} selection
   * @param {*} transferX
   * @param {*} transferY
   */
  drawingPart(selection, transferX, transferY) {
    this.container
      .append("g")
      .attr("transform", `translate(${transferX} ${transferY})`)
      .append(selection);
  }

  /**
   * 渲染平面图
   */
  render() {
    //绘制组件
    this.parts.forEach((item) => {
      const part = new Part({ ...item, scale: this.scale });
      const repeatSpaces = part.repeatSpaces(this.realWidth, this.realHeight);
      //绘制x方向的该组件
      repeatSpaces[0].forEach(async (xSpace) => {
        const partNode = await part.node();
        const transferX = part.transferX + xSpace;
        this.drawingPart(() => partNode, transferX, part.transferY);
      });
      //绘制y方向的该组件
      repeatSpaces[1].forEach(async (ySpace) => {
        const partNode = await part.node();
        const transferY = part.transferY + ySpace;
        this.drawingPart(() => partNode, part.transferX, transferY);
      });
    });

    //绘制标记
    this.markers.forEach((item) => {
      // const mark = new Marker({ ...item });
      // mark.render();
      console.log(item);
    });
  }
}

export default Blueprint;
