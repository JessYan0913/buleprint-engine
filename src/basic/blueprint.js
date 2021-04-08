import { max, min } from "d3-array";
import { svg } from "d3-fetch";
import { select } from "d3-selection";
import "../assets/structure_1.svg";
import "../assets/beam_1.svg";
import "../assets/runway_1.svg";

function isArray(o) {
  return Object.prototype.toString.call(o) == "[object Array]";
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
   * 计算每个重复组件到坐标系的垂直距离
   * @param {*} space
   * @param {*} realLength
   * @param {*} totalLength
   * @returns
   */
  calculateSpaces(space, realLength, totalLength) {
    if (isArray(space)) {
      return space.map((item) => this.scale * item);
    }
    const realSpace = space + realLength;
    const repeatNum = Math.ceil(totalLength / realSpace);
    const spaces = [];
    for (let index = 0; index < repeatNum; index++) {
      spaces.push(realSpace * this.scale * index);
    }
    return spaces;
  }

  /**
   * 组件重复时，x方向和y方法的间距
   * @param {Number} totalWidth
   * @param {Number} totalHeight
   * @returns {Array} [xSpaces, ySpaces]
   */
  spaces(totalWidth, totalHeight) {
    let xSpaces = [];
    let ySpaces = [];
    if (this.repeatX) {
      xSpaces = this.calculateSpaces(
        this.repeatX.space,
        this.realWidth,
        totalWidth
      );
    }
    if (this.repeatY) {
      ySpaces = this.calculateSpaces(
        this.repeatY.space,
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
   *
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
  }

  /**
   * 绘制组件到视图中
   * @param {*} selection
   * @param {*} transferX
   * @param {*} transferY
   */
  drawingPart(selection, transferX, transferY) {
    this.svg
      .append("g")
      .attr("transform", `translate(${transferX} ${transferY})`)
      .append(selection);
  }

  /**
   * 渲染平面图
   */
  render() {
    this.parts.forEach((item) => {
      const part = new Part({ ...item, scale: this.scale });
      const spaces = part.spaces(this.realWidth, this.realHeight);
      spaces[0].forEach(async (xSpace) => {
        const partNode = await part.node();
        const transferX = part.transferX + xSpace;
        this.drawingPart(() => partNode, transferX, part.transferY);
      });
      spaces[1].forEach(async (ySpace) => {
        const partNode = await part.node();
        const transferY = part.transferY + ySpace;
        this.drawingPart(() => partNode, part.transferX, transferY);
      });
    });
  }
}

export default Blueprint;
