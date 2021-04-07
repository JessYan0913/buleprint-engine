<template>
  <div id="root">
  </div>
</template>

<script>
import FloorView from '../basic/floorView'
/**
 * 二维坐标系以左上角为原点
 * 三维坐标系以俯视图左上角为原点，Z轴指向屏幕外
 * width：俯视图中的宽（X轴）
 * height：俯视图中的高（Y轴）
 * depth：正视图中的高（Z轴）
 */
export default {
  name: 'ThreeView',
  mounted() {
    const floorView = new FloorView({
      container: '#root',
      width: 500,
      height: 500,
      relWidth: 14761.98,
      relHeight: 14050,
      parts: [
        {
          image: 'structure_1.svg',
          relWidth: 730,
          relHeight: 14050,
          transfer: {
            x: 0,
            y: 0,
          },
        },
        {
          image: 'beam_1.svg',
          relWidth: 1340,
          relHeight: 12845,
          transfer: {
            x: 562,
            y: 562,
          },
        },
        {
          image: 'runway_1.svg',
          relWidth: 7380.99,
          relHeight: 215.98,
          transfer: {
            x: 0,
            y: 1250,
          },
        },
        {
          image: 'runway_1.svg',
          relWidth: 7380.99,
          relHeight: 215.98,
          transfer: {
            x: 0,
            y: 12550,
          },
        },
      ],
    })

    floorView.render()
  },
}
</script>
