<template>
  <div>
    正视图
    <div id="frontView">
    </div>
  </div>
</template>

<script>
import Blueprint from '../buleprint'

export default {
  name: 'FrontView',
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
          image: 'structure_front.svg',
          realLength: 6000,
          realWidth: 350,
          realHeight: 4000,
        }
      },
    },
    beam: {
      type: Object,
      default() {
        return {
          image: 'beam_front.svg',
          realLength: 6000,
          realWidth: 400,
          realHeight: 400,
        }
      },
    },
    runway: {
      type: Object,
      default() {
        return {
          image: 'runway_front.svg',
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
      const beamParts = this.beams.map((item) => ({
        name: 'beam',
        image: this.beam.image,
        realWidth: item.length,
        realHeight: this.beam.realHeight,
        transfer: {
          x: (this.totalWidth - item.length) / 2,
          y: 450,
        },
      }))
      return [
        {
          name: 'runwayLeft',
          image: this.runway.image,
          realWidth: this.runway.realWidth,
          realHeight: this.runway.realHeight,
          transfer: {
            x: 450,
            y: 200,
          },
        },
        {
          name: 'runwayRight',
          image: this.runway.image,
          realWidth: this.runway.realWidth,
          realHeight: this.runway.realHeight,
          transfer: {
            x: this.totalWidth - 450 - this.runway.realWidth,
            y: 200,
          },
        },
        {
          name: 'structure',
          image: this.support.image,
          realWidth: this.totalWidth,
          realHeight: this.totalHeight,
          transfer: {
            x: 0,
            y: 0,
          },
        },
        ...beamParts
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
          height: -20
        },
        {
          name: 'runwayCantileverMarker',
          start: {
            x: this.support.realWidth,
            y: 200 + this.runway.realHeight
          },
          end: {
            x: 450,
            y: 200 + this.runway.realHeight
          },
          height: -60
        }
      ]
    },
  },
  mounted() {
    const frontView = new Blueprint({
      container: '#frontView',
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

    frontView.render()
  },
}
</script>
