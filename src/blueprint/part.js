import { svg } from "d3-fetch";
import Blueprint from ".";

async function fetchSvg(image) {
  const partSvg = await svg(image);
  return partSvg.documentElement;
}

const Transfer = function Transfer(_scale, options) {
  this.$scale = _scale;
  if (typeof options === "number") {
    this.x = this.y = options;
  } else {
    if (typeof options === void 0) options = {};
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.rotate = options.rotate;
  }
};

Object.defineProperties(Transfer.prototype, {
  screenX: {
    configurable: false,
    get() {
      return this.x * this.$scale;
    },
  },
  screenY: {
    configurable: false,
    get() {
      return this.y * this.$scale;
    },
  },
});

const Part = function Part(_blueprint, props = {}) {
  if (!(_blueprint instanceof Blueprint)) {
    new Error('_blueprint must is Blueprint ')
  }

  this.$blueprint = _blueprint;

  this.name = props.name;
  this.image = `/img/${props.image}`;
  this.realWidth = props.realWidth;
  this.realHeight = props.realHeight;
  this.xRepeatSpaces = props.xRepeatSpaces || [0];
  this.yRepeatSpaces = props.yRepeatSpaces || [];
  this.transfer = new Transfer(this, props.transfer);
};

Part.prototype.drawingPart = function drawingPart(selection, transfer) {
  const part = this.$blueprint.partContainer
    .append("g")
    .attr("transform", `translate(${transfer.screenX} ${transfer.screenY})`)
    .append(selection);
  if (!part.attr("viewBox")) {
    part.attr("viewBox", `0 0 ${part.attr("width").replace("px", "")} ${part.attr("height").replace("px", "")}`);
  }
  part
    .attr("preserveAspectRatio", "none")
    .attr("width", this.realWidth * this.$blueprint.scale)
    .attr("height", this.realHeight * this.$blueprint.scale);
};

Part.prototype.render = async function render() {
  const xPartNodes = [];
  const yPartNodes = [];
  for (let index = 0; index < this.xRepeatSpaces.length; index++) {
    const image = await fetchSvg(this.image);
    xPartNodes.push({
      space: this.xRepeatSpaces[index],
      partNode: image,
    });
  }

  for (let index = 0; index < this.yRepeatSpaces.length; index++) {
    const image = await fetchSvg(this.image);
    yPartNodes.push({
      space: this.yRepeatSpaces[index],
      partNode: image,
    });
  }

  //绘制x方向的该组件
  xPartNodes.forEach(({ space, partNode }) => {
    const transfer = new Transfer(this.$blueprint.scale, {
      x: this.transfer.x + space,
      y: this.transfer.y,
      rotate: this.transfer.rotate,
    });
    this.drawingPart(() => partNode, transfer);
  });

  //绘制y方向的该组件
  yPartNodes.forEach(({ space, partNode }) => {
    const transfer = new Transfer(this.$blueprint.scale, {
      x: this.transfer.x,
      y: this.transfer.y + space,
      rotate: this.transfer.rotate,
    });
    this.drawingPart(() => partNode, transfer);
  });
};

export { fetchSvg, Part };
