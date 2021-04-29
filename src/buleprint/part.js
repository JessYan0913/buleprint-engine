import { svg } from "d3-fetch";

async function fetchSvg(image) {
  const partSvg = await svg(image);
  return partSvg.documentElement;
}

class Part {
  /**
   * 拼接视图的零件，已经绘制好的svg图
   * @param {*} props
   */
  constructor(props) {
    const {
      name,
      image,
      realWidth,
      realHeight,
      transfer = {},
      scale,
      container,
      xRepeatSpaces = [0],
      yRepeatSpaces = []
    } = props;
    this.name = name;
    this.image = `/img/${image}`;
    this.realWidth = realWidth;
    this.realHeight = realHeight;
    this.scale = scale;
    this.container = container;
    this.xRepeatSpaces = xRepeatSpaces;
    this.yRepeatSpaces = yRepeatSpaces;
    this.transferX = transfer.x;
    this.transferY = transfer.y;
  }

  /**
   * 绘制组件到视图中
   * @param {*} selection
   * @param {*} transferX
   * @param {*} transferY
   */
  drawingPart(selection, transferX, transferY) {
    const part = this.container
      .append("g")
      .attr("transform", `translate(${transferX} ${transferY})`)
      .append(selection);
    if (!part.attr("viewBox")) {
      part.attr(
        "viewBox",
        `0 0 ${part.attr("width").replace("px", "")} ${part
          .attr("height")
          .replace("px", "")}`
      );
    }
    part
      .attr("preserveAspectRatio", "none")
      .attr("width", this.realWidth * this.scale)
      .attr("height", this.realHeight * this.scale);
  }

  /**
   * 绘制组件
   */
  render() {
    //绘制x方向的该组件
    this.xRepeatSpaces.forEach(async (xSpace) => {
      const partNode = await fetchSvg(this.image);
      const transferX = (this.transferX + xSpace) * this.scale;
      const transferY = this.transferY * this.scale;
      this.drawingPart(() => partNode, transferX, transferY);
    });
    //绘制y方向的该组件
    this.yRepeatSpaces.forEach(async (ySpace) => {
      const partNode = await fetchSvg(this.image);
      const transferX = this.transferX * this.scale;
      const transferY = (this.transferY + ySpace) * this.scale;
      this.drawingPart(() => partNode, transferX, transferY);
    });
  }
}

export { fetchSvg, Part };
