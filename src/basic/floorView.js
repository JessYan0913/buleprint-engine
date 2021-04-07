import { max, min } from "d3-array";
import { svg } from "d3-fetch";
import { select } from "d3-selection";
import "../assets/structure_1.svg";
import "../assets/beam_1.svg";
import '../assets/runway_1.svg'

class PartImage {
  constructor(props) {
    const { image, relWidth, relHeight, transfer, scale } = props;
    this.image = `/img/${image}`;
    const { x, y} = transfer;
    this.transferX = x * scale;
    this.transferY = y * scale;
    this.relWidth = relWidth;
    this.relHeight = relHeight;
    this.scale = scale;
  }

  async render() {
    const partSvg = await svg(this.image);
    const partGroup = select(partSvg.documentElement);
    partGroup
      .attr(
        "viewBox",
        `0 0 ${partGroup.attr("width")} ${partGroup.attr("height")}`
      )
      .attr("width", this.scale * this.relWidth)
      .attr("height", this.scale * this.relHeight);
    return partGroup;
  }
}

export default class ThreeView {
  constructor(props) {
    const { container, width, height, parts } = props;
    this.container = container;
    this.width = width;
    this.height = height;
    this.parts = parts || [];

    this.svg = select(container)
      .append("svg")
      .attr("style", "background: lightgrey")
      .attr("width", width)
      .attr("height", height);

    const maxRelWidth = max(parts, (item) => item.relWidth);
    const maxRelHeight = max(parts, (item) => item.relHeight);
    this.scale = min([width / maxRelWidth, height / maxRelHeight]);

    this.partImages = this.parts.map(
      (item) => new PartImage({ ...item, scale: this.scale })
    );
  }

  render() {
    this.partImages.forEach(async (item) => {
      const partGroup = await item.render();
      this.svg
        .append("g")
        .attr('transform', `translate(${item.transferX} ${item.transferY})`)
        .append(() => partGroup.node());
    });
  }
}
