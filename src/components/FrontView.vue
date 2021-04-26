<template>
  <div>
    正视图
    <div id="frontView">
    </div>
  </div>
</template>

<script>
import Blueprint from '../basic/blueprint'

export default {
  name: 'FrontView',
  props: {
    width: {
      type: Number,
      default: 1000,
    },
    height: {
      type: Number,
      default: 500,
    },
    creanData: {
      type: Object,
      required: true,
    },
    support: {
      type: Object,
      default() {
        return {
          image: 'structure_1.svg',
          realWidth: 350,
        }
      },
    },
    beam: {
      type: Object,
      default() {
        return {
          image: 'beam_1.svg',
          realWidth: 550,
        }
      },
    },
    runway: {
      type: Object,
      default() {
        return {
          image: 'runway_1.svg',
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
          realHeight: this.supportSpan,
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
        realHeight: item.length,
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
          realWidth: this.totalLength,
          realHeight: this.runway.realHeight,
          transfer: {
            x: 0,
            y: 450,
          },
        },
        {
          name: 'runwayBottom',
          image: this.runway.image,
          realWidth: this.totalLength,
          realHeight: this.runway.realHeight,
          transfer: {
            x: 0,
            y: this.totalWidth - 450 - this.runway.realHeight,
          },
        },
        ...supportParts,
      ]
    },
    markers() {
      const supportMarkers = []
      this.supportDistances.reduce((pre, cur, index) => {
        supportMarkers.push({
          name: `supportDistanceMarker${index}`,
          start: {
            x: pre,
            y: index % 2 === 0 ? 0 : this.totalWidth,
          },
          end: {
            x: pre + cur,
            y: index % 2 === 0 ? 0 : this.totalWidth,
          },
          position: index % 2 === 0 ? 'outer' : 'inner',
        })
        return pre + cur + this.support.realWidth
      }, this.support.realWidth)
      return [
        {
          name: 'supportSpanMarker',
          start: {
            x: 0,
            y: 0,
          },
          end: {
            x: 0,
            y: this.totalWidth,
          },
          height: 40,
        },
        {
          name: 'runwaySpanMarker',
          start: {
            x: 0,
            y: 450 + this.runway.realHeight,
          },
          end: {
            x: 0,
            y: this.totalWidth - 450 - this.runway.realHeight,
          },
        },
        ...supportMarkers,
      ]
    },
  },
  mounted() {
    const frontView = new Blueprint({
      container: '#frontView',
      width: this.width,
      height: this.height,
      realWidth: this.totalLength,
      realHeight: this.totalWidth,
      parts: this.parts,
      markers: this.markers,
    })

    frontView.render()
  },
}
</script>
