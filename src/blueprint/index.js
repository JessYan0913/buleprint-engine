import "../assets";
import { max } from "d3-array";
import { select } from "d3-selection";
import { isArray } from "./utils/array-util";
import { AlignMarker, Arrow, LinearMarker } from "./marker";
import { Part } from "./part";
import { svg } from "d3-fetch";

export async function fetchSvg(image) {
  const partSvg = await svg(image);
  return partSvg.documentElement;
}

const Margin = function Margin(options) {
  if (typeof options === "number") {
    this.top = this.left = this.bottom = this.right = options;
  } else {
    if (typeof options === void 0) options = {};
    this.top = options.top || 40;
    this.left = options.left || 40;
    this.bottom = options.bottom || 40;
    this.right = options.right || 40;
  }
};

const Blueprint = function Blueprint(props = {}) {
  this.container = props.container;
  this.width = Math.max(props.width || 0, 0);
  this.height = Math.max(props.height || 0, 0);
  this.cipt = props.cipt || true;
  this.margin = new Margin(props.margin);
  this.realWidth = Math.max(props.realWidth || 0, 0);
  this.realHeight = Math.max(props.realHeight || 0, 0);
  // this.parts = props.parts || [];
  this.markers = props.markers || [];

  let maxrealWidth = this.realWidth;
  let maxrealHeight = this.realHeight;

  if (props.parts === void 0) props.parts = [];
  // TODO：关于比例尺的计算需要重构，存在BUG
  props.parts.forEach((item) => {
    const { repeatX, repeatY, transfer, realWidth, realHeight } = item;
    if (repeatX) {
      item.xRepeatSpaces = this.calculateSpaces(repeatX.space, transfer.x, realWidth, this.realWidth);
      maxrealWidth = Math.max(max(item.xRepeatSpaces) + realWidth, maxrealWidth);
    }
    if (repeatY) {
      item.yRepeatSpaces = this.calculateSpaces(repeatY.space, transfer.y, realWidth, this.realWidth);
      maxrealHeight = Math.max(max(item.yRepeatSpaces) + realHeight, maxrealHeight);
    }
  });

  this.scale = Math.min(this.width / maxrealWidth, this.height / maxrealHeight, Math.max(props.scale || 1, 0));

  this.svg = select(this.container)
    .append("svg")
    .attr("width", this.width)
    .attr("height", this.height);

  this.partContainer = this.svg.append("g").attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

  this.parts = props.parts.map((item) => new Part(this, item));

  this.markerContainer = this.svg.append("g").attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

  new Arrow(this);
};

Blueprint.prototype.calculateSpaces = function calculateSpaces(space, transfer, length, totalLength) {
  if (isArray(space)) {
    return space;
  }
  const realSpace = space + length;
  const repeatNum = Math.ceil((totalLength - transfer) / realSpace);
  const spaces = [];
  for (let index = 0; index < repeatNum; index++) {
    spaces.push(realSpace * index);
  }
  return spaces;
};

Blueprint.prototype.clipSvg = function clipSvg() {
  const { width: partContainerWidth, height: partContainerHeight } = this.partContainer.node().getBBox();
  const { width: markerContainerWidth, height: markerContainerHeight } = this.markerContainer.node().getBBox();

  const maxContainerWidth = Math.max(partContainerWidth, markerContainerWidth) + this.margin.right + 50;
  const maxContainerHeight = Math.max(partContainerHeight, markerContainerHeight) + this.margin.bottom + 50;

  this.svg.attr("width", maxContainerWidth).attr("height", maxContainerHeight);
};

Blueprint.prototype.render = async function render() {
  for (let index = 0; index < this.parts.length; index++) {
    const item = this.parts[index];
    await item.render();
  }

  this.markers.forEach((item) => {
    if (item.hidden) {
      return;
    }
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

  if (this.cipt) {
    this.clipSvg();
  }
};

export default Blueprint;
