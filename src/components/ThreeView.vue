<template>
  <div>
    <div>
      <button @click="handleDownloadPdf">下载PDF</button>
    </div>
    <vue-html2pdf :show-layout="true"
                  :float-layout="false"
                  :enable-download="true"
                  :preview-modal="true"
                  :paginate-elements-by-height="1400"
                  :pdf-quality="2"
                  :manual-pagination="false"
                  pdf-format="a3"
                  pdf-orientation="landscape"
                  pdf-content-width="1400px"
                  ref="html2Pdf"
                  :style="{ marginLeft: '100px' }">
      <div slot="pdf-content">
        <vertical-view :creanData="{
          totalLength,
          totalWidth,
          supportSpan,
          supportDistances,
          beams
        }" />
      </div>
    </vue-html2pdf>
  </div>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf'
import VerticalView from './VerticalView'

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
  },
  data() {
    return {
      totalLength: 18000,
      totalWidth: 6000,
      totalHeight: 10000,
      supportSpan: 6000,
      supportDistances: [6000, 6000, 4500],
      beams: [
        {
          length: 5000,
        },
        {
          length: 6000,
        },
      ],
    }
  },
  methods: {
    handleDownloadPdf() {
      this.$refs.html2Pdf.generatePdf()
    },
  },
}
</script>
