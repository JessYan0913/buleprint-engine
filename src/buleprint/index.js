import "../assets";
import { max } from "d3-array";
import { select } from "d3-selection";
import { isArray } from "./utils/array-util";
import { AlignMarker, LinearMarker, defMarkerArrow } from "./marker";
import { Part } from "./part";

/**
 * 计算重复组件距离坐标系的垂直距离
 * @param {*} space
 * @param {*} transfer
 * @param {*} realLength
 * @param {*} totalLength
 * @returns
 */
function calculateSpaces(space, transfer, realLength, totalLength) {
  if (isArray(space)) {
    return space;
  }
  const realSpace = space + realLength;
  const repeatNum = Math.ceil((totalLength - transfer) / realSpace);
  const spaces = [];
  for (let index = 0; index < repeatNum; index++) {
    spaces.push(realSpace * index);
  }
  return spaces;
}

class Blueprint {
  /**
   * 平面图
   * @param {*} props
   */
  constructor(props) {
    const {
      container,
      width,
      height,
      margin,
      cipt = true,
      scale = 1,
      realWidth,
      realHeight,
      parts = [],
      markers = [],
    } = props;
    this.container = container;
    this.width = Math.max(width, 0);
    this.height = Math.max(height, 0);
    this.cipt = cipt;
    this.margin = { top: 40, left: 40, bottom: 40, right: 40, ...margin };
    this.realWidth = Math.max(realWidth, 0);
    this.realHeight = Math.max(realHeight, 0);
    this.parts = parts;
    this.markers = markers;
    this.scale = Math.max(scale, 0);

    this.svgWidth = width + this.margin.left + this.margin.right;
    this.svgHeight = height + this.margin.top + this.margin.bottom;

    this.calculateScale();

    this.svg = select(container)
      .append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    this.partContainer = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    this.markerContainer = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
  }

  calculateScale() {
    let maxrealWidth = this.realWidth;
    let maxrealHeight = this.realHeight;
    this.parts.forEach((item) => {
      const { repeatX, repeatY, transfer, realWidth, realHeight } = item;
      if (repeatX) {
        item.xRepeatSpaces = calculateSpaces(
          repeatX.space,
          transfer.x,
          realWidth,
          this.realWidth
        );
        maxrealWidth = Math.max(
          max(item.xRepeatSpaces) + realWidth,
          maxrealWidth
        );
      }
      if (repeatY) {
        item.yRepeatSpaces = calculateSpaces(
          repeatY.space,
          transfer.y,
          realWidth,
          this.realWidth
        );
        maxrealHeight = Math.max(
          max(item.yRepeatSpaces) + realHeight,
          maxrealHeight
        );
      }
    });
    this.scale = Math.min(
      this.width / maxrealWidth,
      this.height / maxrealHeight,
      this.scale
    );
  }

  /**
   * 裁剪SVG到适合的宽度
   */
  clipSvg() {
    const {
      width: partContainerWidth,
      height: partContainerHeight,
    } = this.partContainer.node().getBBox();
    const {
      width: markerContainerWidth,
      height: markerContainerHeight,
    } = this.markerContainer.node().getBBox();
    const maxContainerWidth =
      Math.max(partContainerWidth, markerContainerWidth) +
      this.margin.right;
    const maxContainerHeight =
      Math.max(partContainerHeight, markerContainerHeight) +
      this.margin.bottom;
    this.svg
      .attr("width", maxContainerWidth)
      .attr("height", maxContainerHeight);
  }

  /**
   * 渲染平面图
   */
  async render() {
    //绘制组件
    for (let index = 0; index < this.parts.length; index++) {
      const item = this.parts[index];
      const part = new Part({
        ...item,
        scale: this.scale,
        container: this.partContainer,
      });
      await part.render(this.realWidth, this.realHeight);
    }

    //在尺寸线的容器中添加箭头定义
    defMarkerArrow({
      container: this.markerContainer,
    });
    //绘制标记
    this.markers.forEach((item) => {
      const markerProps = {
        ...item,
        scale: this.scale,
        container: this.markerContainer,
      };
      if (item.type === "linear") {
        const mark = new LinearMarker({ ...markerProps });
        mark.render();
        return;
      }
      const mark = new AlignMarker({ ...markerProps });
      mark.render();
    });

    //是否裁剪SVG
    if (this.cipt) {
      this.clipSvg();
    }
  }
}

export default Blueprint;
