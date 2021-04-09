import { svg } from "d3-fetch";
import { select } from "d3-selection";
import { isArray } from "./utils/array-util";

/**
 * 计算每个重复组件到坐标系的垂直距离
 * @param {*} space
 * @param {*} scale
 * @param {*} realLength
 * @param {*} totalLength
 * @returns
 */
function calculateSpaces(space, scale, realLength, totalLength) {
  if (isArray(space)) {
    return space.map((item) => scale * item);
  }
  const realSpace = space + realLength;
  const repeatNum = Math.ceil(totalLength / realSpace);
  const spaces = [];
  for (let index = 0; index < repeatNum; index++) {
    spaces.push(realSpace * scale * index);
  }
  return spaces;
}

class Part {
  /**
   * 三视图拼接组件
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
    } = props;
    this.name = name;
    this.image = `/img/${image}`;
    this.realWidth = realWidth;
    this.realHeight = realHeight;
    this.scale = scale;

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
    partGroup
      .attr(
        "viewBox",
        `0 0 ${partGroup.attr("width")} ${partGroup.attr("height")}`
      )
      .attr("width", this.scale * this.realWidth)
      .attr("height", this.scale * this.realHeight);
    return partGroup.node();
  }
}

export default Part;
