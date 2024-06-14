<script>
import echarts from "@/plugins/echarts";
import { debounce } from "lodash-es";
import "echarts-wordcloud";
import { isString } from "@/utils/is";

export default {
  name: "EChart",
  props: {
    options: {
      type: Object,
      required: true,
    },
    width: {
      type: [Number, String],
      default: "",
    },
    height: {
      type: [Number, String],
      default: "500px",
    },
  },
  computed: {
    isDark() {
      return true;
    },
    theme() {
      return this.isDark ? true : "auto";
    },
    currentOptions() {
      return Object.assign(this.options, {
        darkMode: this.theme,
      });
    },
    styles() {
      const width = isString(this.width) ? this.width : `${this.width}px`;
      const height = isString(this.height) ? this.height : `${this.height}px`;

      return {
        width,
        height,
      };
    },
  },
  methods: {
    initChart() {
      if (this.$refs.elRef && this.currentOptions) {
        this.echartRef = echarts.init(this.$refs.elRef);
        this.echartRef.setOption(this.currentOptions);
      }
    },
    resizeHandler: debounce(() => {
      if (this.echartRef) {
        this.echartRef.resize();
      }
    }, 100),
    contentResizeHandler(e) {
      if (e.propertyName === "width") {
        this.resizeHandler();
      }
    },
  },
  watch: {
    options: {
      handler() {
        if (this.echartRef) {
          this.echartRef.setOption(this.currentOptions);
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.initChart();

    window.addEventListener("resize", this.resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  onActivated() {
    if (this.echartRef) {
      this.echartRef.resize();
    }
  },
};
</script>

<template>
  <div ref="elRef" :class="[$attrs.class]" :style="styles"></div>
</template>
