<template>
  <div>
    俯视图
    <div id="verticalView">
    </div>
  </div>
</template>

<script>
import Blueprint from '../basic/blueprint'

export default {
  name: 'VerticalView',
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
          realLength: 6000,
          realWidth: 350,
          realHeight: 4000
        }
      },
    },
    beam: {
      type: Object,
      default() {
        return {
          image: 'beam_1.svg',
          realLength: 6000,
          realWidth: 400,
          realHeight: 400
        }
      },
    },
    runway: {
      type: Object,
      default() {
        return {
          image: 'runway_1.svg',
          realLength: 6000,
          realWidth: 200,
          realHeight: 400,
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
          realWidth: this.runway.realLength,
          realHeight: this.runway.realWidth,
          repeatX: {
            space: 0
          },
          transfer: {
            x: 0,
            y: 450,
          },
        },
        {
          name: 'runwayBottom',
          image: this.runway.image,
          realWidth: this.runway.realLength,
          realHeight: this.runway.realWidth,
          repeatX: {
            space: 0
          },
          transfer: {
            x: 0,
            y: this.totalWidth - 450 - this.runway.realWidth,
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
            y: 450 + this.runway.realWidth,
          },
          end: {
            x: 0,
            y: this.totalWidth - 450 - this.runway.realWidth,
          },
        },
        ...supportMarkers,
      ]
    },
  },
  mounted() {
    const verticalView = new Blueprint({
      container: '#verticalView',
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

    verticalView.render()
  },
}
</script>