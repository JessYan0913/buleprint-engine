import assert, { assertTypes } from "./utils/assert";

const Transfer = function Transfer(_scale, options) {
  this.$scale = _scale;
  if (typeof options === "number") {
    this.x = this.y = options;
  } else {
    if (options === void 0) options = {};
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
  assertTypes.blueprintAssert("_blueprint", _blueprint);

  this.$blueprint = _blueprint;

  this.name = props.name;
  this.image = props.image;
  this.realWidth = props.realWidth;
  this.realHeight = props.realHeight;
  this.xRepeatSpaces = props.xRepeatSpaces || [0];
  this.yRepeatSpaces = props.yRepeatSpaces || [];
  this.transfer = new Transfer(this.$blueprint.scale, props.transfer);
};

Part.prototype.drawingPart = function drawingPart(selection, transfer) {
  const part = this.$blueprint.partContainer
    .append("g")
    .attr("transform", () => {
      const isNeedRotate = transfer.rotate && (typeof transfer.rotate === "number" || !isNaN(+transfer.rotate));
      if (isNeedRotate) {
        return `translate(${transfer.screenX} ${transfer.screenY})rotate(${transfer.rotate})`;
      }
      return `translate(${transfer.screenX} ${transfer.screenY})`;
    })
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
    let image = this.image;
    //TODO: 此处需要优化，同样的image，不需要重复的请求获取
    if (typeof image === "function") {
      image = await image();
    }
    assert(Object.getPrototypeOf(image).constructor.name === "SVGSVGElement", " part's image must is SVGSVGElement");
    xPartNodes.push({
      space: this.xRepeatSpaces[index],
      partNode: image,
    });
  }

  for (let index = 0; index < this.yRepeatSpaces.length; index++) {
    let image = this.image;
     //TODO: 此处需要优化，同样的image，不需要重复的请求获取
    if (typeof image === "function") {
      image = await image();
    }
    assert(Object.getPrototypeOf(image).constructor.name === "SVGSVGElement", " part's image must is SVGSVGElement");
    yPartNodes.push({
      space: this.yRepeatSpaces[index],
      partNode: image,
    });
  }

  // 绘制x方向的该组件
  xPartNodes.forEach(({ space, partNode }) => {
    const transfer = new Transfer(this.$blueprint.scale, {
      x: this.transfer.x + space,
      y: this.transfer.y,
      rotate: this.transfer.rotate,
    });
    this.drawingPart(() => partNode, transfer);
  });

  // 绘制y方向的该组件
  yPartNodes.forEach(({ space, partNode }) => {
    const transfer = new Transfer(this.$blueprint.scale, {
      x: this.transfer.x,
      y: this.transfer.y + space,
      rotate: this.transfer.rotate,
    });
    this.drawingPart(() => partNode, transfer);
  });
};

export default Part;
