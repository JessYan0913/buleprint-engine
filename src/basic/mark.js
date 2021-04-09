import { selection } from "d3-selection";
import { symbol } from "d3-shape";

class Mark {
  constructor(props) {
    const { svg, sizeNum, scale } = props;
    this.svg = selection(svg);
    this.sizeNum = sizeNum;
    this.scale = scale;
    this.container = this.svg.append("g");
  }

  drawingArrow() {
    const arrowGroup = this.container.append("g");
    arrowGroup.append("path").attr(
      "d",
      symbol()
        .type(symbol[5])
        .size(10)
    );
  }
}

export default Mark;
