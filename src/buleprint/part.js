import { svg } from "d3-fetch";
import { select } from "d3-selection";
import { calculateSpaces } from "./utils/math-util";

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
      repeatX = {},
      repeatY = {},
      transfer = {},
      scale,
      container,
    } = props;
    this.name = name;
    this.image = `/img/${image}`;
    this.realWidth = realWidth;
    this.realHeight = realHeight;
    this.scale = scale;
    this.container = container;

    //将真实的偏移量换算为屏幕上的偏移
    this.transferX = transfer.x * scale;
    this.transferY = transfer.y * scale;

    this.repeatX = repeatX;
    this.repeatY = repeatY;
  }

  /**
   * 组件重复时，x方向和y方法的间距
   * @param {Number} totalWidth
   * @param {Number} totalHeight
   * @returns {Array} [xSpaces, ySpaces]
   */
  repeatSpaces(totalWidth, totalHeight) {
    let xSpaces = [];
    let ySpaces = [];
    if (this.repeatX) {
      xSpaces = calculateSpaces(
        this.repeatX.space,
        this.scale,
        this.realWidth,
        totalWidth
      );
    }
    if (this.repeatY) {
      ySpaces = calculateSpaces(
        this.repeatY.space,
        this.scale,
        this.realHeight,
        totalHeight
      );
    }
    if (xSpaces.length === 0 && ySpaces.length === 0) {
      xSpaces.push(0);
    }
    return [xSpaces, ySpaces];
  }

  /**
   * 读取svg图，并按照比例缩放
   * @returns {documentElement} node
   */
  async node() {
    const partSvg = await svg(this.image);
    const partGroup = select(partSvg.documentElement);
    if (!partGroup.attr("viewBox")) {
      partGroup.attr(
        "viewBox",
        `0 0 ${partGroup.attr("width").replace("px", "")} ${partGroup
          .attr("height")
          .replace("px", "")}`
      );
    }
    partGroup
      .attr("preserveAspectRatio", "none")
      .attr("width", this.scale * this.realWidth)
      .attr("height", this.scale * this.realHeight);
    return partGroup.node();
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
   * 绘制组件
   * @param {Number} totalWidth 大组件的整体宽度
   * @param {Number} totalHeight 大组件的整体高度
   */
  render(totalWidth, totalHeight) {
    const repeatSpaces = this.repeatSpaces(totalWidth, totalHeight);

    //绘制x方向的该组件
    repeatSpaces[0].forEach(async (xSpace) => {
      const partNode = await this.node();
      const transferX = this.transferX + xSpace;
      this.drawingPart(() => partNode, transferX, this.transferY);
    });
    //绘制y方向的该组件
    repeatSpaces[1].forEach(async (ySpace) => {
      const partNode = await this.node();
      const transferY = this.transferY + ySpace;
      this.drawingPart(() => partNode, this.transferX, transferY);
    });
  }
}

export default Part;
