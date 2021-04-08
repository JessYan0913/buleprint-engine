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
      realWidth: 14761.98 * 2,
      realHeight: 14050 * 2,
      parts: [
        {
          name: 'structure',
          image: 'structure_1.svg',
          realWidth: 730,
          realHeight: 14050,
          repeat: {
            x: {
              // space: 6300,
              space: 6300,
            },
          },
          transfer: {
            x: 0,
            y: 0,
          },
        },
        // {
        //   name: 'beam',
        //   image: 'beam_1.svg',
        //   realWidth: 1340,
        //   realHeight: 12845,
        //   transfer: {
        //     x: 562,
        //     y: 562,
        //   },
        // },
        {
          name: 'runwayTop',
          image: 'runway_1.svg',
          realWidth: 7380.99,
          realHeight: 215.98,
          repeat: {
            x: {
              space: 0,
            },
          },
          transfer: {
            x: 0,
            y: 1250,
          },
        },
        {
          name: 'runwayBottom',
          image: 'runway_1.svg',
          realWidth: 7380.99,
          realHeight: 215.98,
          repeat: {
            x: {
              space: 0,
            },
          },
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
