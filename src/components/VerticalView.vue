<template>
  <div id="verticalView">
  </div>
</template>

<script>
import Blueprint from '../basic/blueprint'

export default {
  props: {
    creanData: {
      type: Object,
      required: true,
    },
    supportImage: {
      type: String,
      default: 'structure_1.svg',
    },
    beamImage: {
      type: String,
      default: 'beam_1.svg',
    },
    runwayImage: {
      type: String,
      default: 'runway_1.svg',
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
          image: this.supportImage,
          realWidth: 350,
          realHeight: this.supportSpan,
          transfer: {
            x: pre + cur,
            y: 0,
          },
        })
        return pre + cur + 350
      }, 0)
      const beamParts = this.beams.map((item, index) => ({
        name: 'beam',
        image: this.beamImage,
        realWidth: 350,
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
          image: this.runwayImage,
          realWidth: this.totalLength,
          realHeight: 200,
          transfer: {
            x: 0,
            y: 450,
          },
        },
        {
          name: 'runwayBottom',
          image: this.runwayImage,
          realWidth: this.totalLength,
          realHeight: 200,
          transfer: {
            x: 0,
            y: this.totalWidth - 450 - 200,
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
        return pre + cur + 350
      }, 350)
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
            y: 450,
          },
          end: {
            x: 0,
            y: this.totalWidth - 450,
          },
        },
        ...supportMarkers,
      ]
    },
  },
  mounted() {
    const verticalView = new Blueprint({
      container: '#verticalView',
      width: 1000,
      height: 1000,
      margin: {
        top: 100,
        left: 100,
        bottom: 100,
        right: 100,
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