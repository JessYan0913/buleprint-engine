import { max, min } from "d3-array";
import { svg } from "d3-fetch";
import { select } from "d3-selection";
import "../assets/structure_1.svg";
import "../assets/beam_1.svg";
import "../assets/runway_1.svg";

class PartImage {
  constructor(props) {
    const {
      name,
      image,
      realWidth,
      realHeight,
      repeat = {},
      transfer = {},
      scale,
    } = props;
    this.name = name;
    this.image = `/img/${image}`;
    this.realWidth = realWidth;
    this.realHeight = realHeight;
    this.scale = scale;

    this.transferX = transfer.x * scale;
    this.transferY = transfer.y * scale;

    this.repeat = repeat;
  }

  async render() {
    const partSvg = await svg(this.image);
    const partGroup = select(partSvg.documentElement);
    partGroup
      .attr(
        "viewBox",
        `0 0 ${partGroup.attr("width")} ${partGroup.attr("height")}`
      )
      .attr("width", this.scale * this.realWidth)
      .attr("height", this.scale * this.realHeight);
    return partGroup;
  }
}

export default class ThreeView {
  constructor(props) {
    const {
      container,
      width,
      height,
      realWidth,
      realHeight,
      parts = [],
    } = props;
    this.container = container;
    this.width = width;
    this.height = height;
    this.realWidth = realWidth;
    this.realHeight = realHeight;
    this.parts = parts || [];

    this.svg = select(container)
      .append("svg")
      .attr("style", "background: lightgrey")
      .attr("width", width)
      .attr("height", height);

    const mergeArray = (sourceArr, targetArr) =>
      sourceArr.reduce((pre, cur) => {
        pre.push(cur);
        return pre;
      }, targetArr);

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
    this.scale = min([width / maxrealWidth, height / maxrealHeight]);

    this.partImages = this.parts.map(
      (item) => new PartImage({ ...item, scale: this.scale })
    );
  }

  render() {
    this.partImages.forEach(async (item) => {
      const repeatX = item.repeat.x;
      if (repeatX) {
        const repeatNum = Math.ceil(
          this.realWidth / (item.realWidth + repeatX.space)
        );
        for (let index = 0; index < repeatNum; index++) {
          const partGroup = await item.render();
          this.svg
            .append("g")
            .attr(
              "transform",
              `translate(${item.transferX +
                (repeatX.space * this.scale * index + item.realWidth * index * this.scale)} ${
                item.transferY
              })`
            )
            .append(() => partGroup.node());
        }
      } else {
        const partGroup = await item.render();
        this.svg
          .append("g")
          .attr("transform", `translate(${item.transferX} ${item.transferY})`)
          .append(() => partGroup.node());
      }
    });
  }
}
