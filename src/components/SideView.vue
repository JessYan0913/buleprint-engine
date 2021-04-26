<template>
  <div>
    侧视图
    <div id="sideView">
    </div>
  </div>
</template>

<script>
import Blueprint from '../basic/blueprint'

export default {
  name: 'SideView',
  props: {
    width: {
      type: Number,
      default: 1000,
    },
    height: {
      type: Number,
      default: 800,
    },
    creanData: {
      type: Object,
      required: true,
    },
    support: {
      type: Object,
      default() {
        return {
          image: 'structure_2.svg',
          realWidth: 350,
        }
      },
    },
    beam: {
      type: Object,
      default() {
        return {
          image: 'beam_2.svg',
          realWidth: 550,
          realHeight: 400,
        }
      },
    },
    runway: {
      type: Object,
      default() {
        return {
          image: 'runway_2.svg',
          realWidth: 6000,
          realHeight: 200,
        }
      },
    },
  },
  data() {
    return { ...this.creanData }
  },
  computed: {
    parts() {
      const supportParts = []
      const supportDistances = [...this.supportDistances]
      supportDistances.unshift(0)
      supportDistances.reduce((pre, cur) => {
        supportParts.push({
          name: 'structure',
          image: this.support.image,
          realWidth: this.support.realWidth,
          realHeight: this.totalHeight,
          transfer: {
            x: pre + cur,
            y: 0,
          },
        })
        return pre + cur + this.support.realWidth
      }, 0)
      const beamParts = this.beams.map((item, index) => ({
        name: 'beam',
        image: this.beam.image,
        realWidth: this.beam.realWidth,
        realHeight: this.beam.realHeight,
        transfer: {
          x: 3000 * (index * 2.4 + 1),
          y: (this.totalWidth - item.length) / 2,
        },
      }))
      return [
        ...beamParts,
        {
          name: 'runwayTop',
          image: this.runway.image,
          realWidth: this.runway.realWidth,
          realHeight: this.runway.realHeight,
          repeatX: {
            space: 0
          },
          transfer: {
            x: 0,
            y: 200,
          },
        },
        ...supportParts,
      ]
    },
    markers() {
      return [
        {
          name: 'supportHeightMarker',
          start: {
            x: 0,
            y: 0,
          },
          end: {
            x: 0,
            y: this.totalHeight,
          },
          height: 40,
        },
        {
          name: 'runwayHeightMarker',
          start: {
            x: 0,
            y: 200 + this.runway.realHeight,
          },
          end: {
            x: 0,
            y: this.totalHeight,
          },
        },
      ]
    },
  },
  mounted() {
    const sideView = new Blueprint({
      container: '#sideView',
      width: this.width,
      height: this.height,
      margin: {
        top: 60,
        left: 60,
        bottom: 60,
        right: 60,
      },
      realWidth: this.totalLength,
      realHeight: this.totalWidth,
      parts: this.parts,
      markers: this.markers,
    })

    sideView.render()
  },
}
</script>