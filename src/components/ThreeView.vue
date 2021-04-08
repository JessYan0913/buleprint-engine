<template>
  <div>
    <div id="verticalView">
    </div>
    <div id="frontView">
    </div>
    <div id="sideView">
    </div>
  </div>
</template>

<script>
import Blueprint from '../basic/blueprint'
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
    const verticalView = new Blueprint({
      container: '#verticalView',
      width: 500,
      height: 500,
      realWidth: 14761.98,
      realHeight: 14050,
      parts: [
        {
          name: 'structure',
          image: 'structure_1.svg',
          realWidth: 730,
          realHeight: 14050,
          repeatX: {
            space: 6300,
          },
          transfer: {
            x: 0,
            y: 0,
          },
        },
        {
          name: 'beam',
          image: 'beam_1.svg',
          realWidth: 1340,
          realHeight: 12845,
          transfer: {
            x: 562,
            y: 562,
          },
        },
        {
          name: 'runwayTop',
          image: 'runway_1.svg',
          realWidth: 7380.99,
          realHeight: 215.98,
          repeatX: {
            space: 0,
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
          repeatX: {
            space: 0,
          },
          transfer: {
            x: 0,
            y: 12550,
          },
        },
      ],
    })

    verticalView.render()

    const frontView = new Blueprint({
      container: '#frontView',
      width: 500,
      height: 500,
      realWidth: 14761.98,
      realHeight: 14050,
      parts: [
        {
          name: 'structure',
          image: 'structure_2.svg',
          realWidth: 730,
          realHeight: 14050,
          repeatX: {
            space: 6300,
          },
          transfer: {
            x: 0,
            y: 0,
          },
        },
        {
          name: 'beam',
          image: 'beam_2.svg',
          realWidth: 1040,
          realHeight: 745,
          transfer: {
            x: 962,
            y: 262,
          },
        },
        {
          name: 'runwayTop',
          image: 'runway_2.svg',
          realWidth: 7380.99,
          realHeight: 215.98,
          repeatX: {
            space: 0,
          },
          transfer: {
            x: 0,
            y: 300,
          },
        },
      ],
    })

    frontView.render()

    const sideView = new Blueprint({
      container: '#sideView',
      width: 500,
      height: 500,
      realWidth: 14761.98,
      realHeight: 14050,
      parts: [
        {
          name: 'structure',
          image: 'structure_3.svg',
          realWidth: 14761.98,
          realHeight: 14050,
          transfer: {
            x: 0,
            y: 0,
          },
        },
        {
          name: 'beam',
          image: 'beam_3.svg',
          realWidth: 13461.98,
          realHeight: 700,
          transfer: {
            x: 642,
            y: 482,
          },
        },
      ],
    })

    sideView.render()
  },
}
</script>
