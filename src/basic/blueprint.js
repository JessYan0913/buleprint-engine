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
      margin,
      realWidth,
      realHeight,
      parts = [],
      markers = [],
    } = props;
    this.container = container;
    this.width = width;
    this.height = height;
    this.margin = { top: 40, left: 40, bottom: 40, right: 40, ...margin };
    this.realWidth = realWidth;
    this.realHeight = realHeight;
    this.parts = parts;
    this.markers = markers;

    this.svg = select(container)
      .append("svg")
      .attr("style", "background: lightgrey")
      .attr("width", width)
      .attr("height", height);

    this.innerWidth = width - this.margin.left - this.margin.right;
    this.innerHeight = height - this.margin.top - this.margin.bottom;

    //获取所有宽度
    const widths = mergeArray(
      parts.map((item) => item.width),
      [realWidth]
    );
    //获取所有高度
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
   * 渲染平面图
   */
  render() {
    const partContainer = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    //绘制组件
    this.parts.forEach((item) => {
      const part = new Part({
        ...item,
        scale: this.scale,
        container: partContainer,
      });
      part.render(this.realWidth, this.realHeight);
    });

    const markerContainer = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    Marker.generateArrow(markerContainer);
    //绘制标记
    this.markers.forEach((item) => {
      const mark = new Marker({
        ...item,
        scale: this.scale,
        container: markerContainer,
      });
      mark.render();
    });
  }
}

export default Blueprint;
