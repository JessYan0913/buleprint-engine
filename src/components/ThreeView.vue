<template>
  <div>
    <div>
      <button @click="handleDownloadPdf">下载PDF</button>
    </div>
    <vue-html2pdf :show-layout="true"
                  :float-layout="false"
                  :enable-download="true"
                  :preview-modal="true"
                  :paginate-elements-by-height="5600"
                  :pdf-quality="2"
                  :manual-pagination="false"
                  pdf-format="a3"
                  pdf-orientation="landscape"
                  pdf-content-width="5600px"
                  ref="html2Pdf"
                  :style="{ marginLeft: '10px' }">
      <div slot="pdf-content">
        <vertical-view :creanData="creanData"
                       :width="width"
                       :height="height" />
        <side-view :creanData="creanData"
                   :width="width"
                   :height="height" />
        <front-view :creanData="creanData"
                    :width="width"
                    :height="height" />
      </div>
    </vue-html2pdf>
  </div>
</template>

<script>
import '../assets'
import VueHtml2pdf from 'vue-html2pdf'
import VerticalView from './VerticalView'
import SideView from './SideView'
import FrontView from './FrontView'

/**
 * 二维坐标系以左上角为原点
 * 三维坐标系以俯视图左上角为原点，Z轴指向屏幕外
 * width：俯视图中的宽（X轴）
 * height：俯视图中的高（Y轴）
 * depth：正视图中的高（Z轴）
 */
export default {
  name: 'ThreeView',
  components: {
    VueHtml2pdf,
    VerticalView,
    SideView,
    FrontView,
  },
  props: {
    creanData: {
      type: Object,
      default() {
        return {
          totalLength: 25000,
          totalWidth: 6000,
          totalHeight: 4000,
          supportSpan: 6000,
          supportDistances: [6000, 6000, 4500],
          beams: [
            {
              length: 5600,
            },
          ],
        }
      },
    },
  },
  data() {
    return {
      width: 1000,
      height: 800,
    }
  },
  methods: {
    handleDownloadPdf() {
      this.$refs.html2Pdf.generatePdf()
    },
  },
}
</script>
