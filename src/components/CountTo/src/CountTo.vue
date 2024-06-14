<script>
import { isNumber } from "@/utils/is";

export default {
  name: "CountTo",
  props: {
    // 开始播放值
    startVal: {
      type: Number,
      default: 0,
    },
    // 最终值
    endVal: {
      type: Number,
      default: 2024,
    },
    // 动画时长
    duration: {
      type: Number,
      default: 3000,
    },
    // 是否自动播放动画, 默认播放
    autoplay: {
      type: Boolean,
      default: true,
    },
    // 显示的小数位数, 默认不显示小数
    decimals: {
      type: Number,
      default: 0,
      validate(val) {
        return value >= 0;
      },
    },
    // 小数分隔符号, 默认为点
    decimal: {
      type: String,
      default: ".",
    },
    // 数字每三位的分隔符, 默认为逗号
    separator: {
      type: String,
      default: ",",
    },
    // 前缀, 数值前面显示的内容
    prefix: {
      type: String,
      default: "",
    },
    // 后缀, 数值后面显示的内容
    suffix: {
      type: String,
      default: "",
    },
    // 是否使用缓动效果, 默认启用
    useEasing: {
      type: Boolean,
      default: true,
    },
    // 缓动函数
    easingFn: {
      type: Function,
      default(t, b, c, d) {
        return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
      },
    },
  },
  data() {
    return {
      localStartVal: this.startVal,
      displayValue: this.formatNumber(this.startVal),
      printVal: null,
      paused: false,
      localDuration: this.duration,
      startTime: null,
      timestamp: null,
      remaining: null,
      rAF: null,
    };
  },
  methods: {
    formatNumber(num) {
      const { decimals, decimal, separator, suffix, prefix } = this;
      num = Number(num).toFixed(decimals);
      num += "";
      const x = num.split(".");
      let x1 = x[0];
      const x2 = x.length > 1 ? decimal + x[1] : "";
      const rgx = /(\d+)(\d{3})/;
      if (separator && !isNumber(separator)) {
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, "$1" + separator + "$2");
        }
      }
      return prefix + x1 + x2 + suffix;
    },
    start() {
      const { startVal, duration } = this;
      this.localStartVal = startVal;
      this.startTime = null;
      this.localDuration = duration;
      this.paused = false;
      this.rAF = requestAnimationFrame(this.count);
    },
    pauseResume() {
      if (this.paused) {
        resume();
        this.paused = false;
      } else {
        pause();
        this.paused = true;
      }
    },
    pause() {
      cancelAnimationFrame(this.rAF);
    },
    resume() {
      this.startTime = null;
      this.localDuration = +this.remaining;
      this.localStartVal = +this.printVal;
      requestAnimationFrame(this.count);
    },
    reset() {
      this.startTime = null;
      cancelAnimationFrame(this.rAF);
      this.displayValue = this.formatNumber(this.startVal);
    },
    count(timestamp) {
      const { useEasing, easingFn, endVal } = this;
      if (!this.startTime) this.startTime = timestamp;
      this.timestamp = timestamp;
      const progress = timestamp - this.startTime;
      this.remaining = this.localDuration - progress;
      if (useEasing) {
        if (this.getCountDown) {
          this.printVal =
            this.localStartVal -
            easingFn(
              progress,
              0,
              this.localStartVal - endVal,
              this.localDuration,
            );
        } else {
          this.printVal = easingFn(
            progress,
            this.localStartVal,
            endVal - this.localStartVal,
            this.localDuration,
          );
        }
      } else {
        if (this.getCountDown) {
          this.printVal =
            this.localStartVal -
            (this.localStartVal - endVal) * (progress / this.localDuration);
        } else {
          this.printVal =
            this.localStartVal +
            (endVal - this.localStartVal) * (progress / this.localDuration);
        }
      }
      if (this.getCountDown) {
        this.printVal = this.printVal < endVal ? endVal : this.printVal;
      } else {
        this.printVal = this.printVal > endVal ? endVal : this.printVal;
      }
      this.displayValue = this.formatNumber(this.printVal);
      if (progress < this.localDuration) {
        this.rAF = requestAnimationFrame(this.count);
      } else {
        this.$emit("callback");
      }
    },
  },
  computed: {
    getCountDown() {
      return this.startVal > this.endVal;
    },
  },
  watch: {
    startVal() {
      if (this.autoplay) {
        this.start();
      }
    },
    endVal() {
      if (this.autoplay) {
        this.start();
      }
    },
  },
  mounted() {
    if (this.autoplay) {
      this.start();
    }
    this.$emit("mounted");
  },
};
</script>

<template>
  <span>
    {{ displayValue }}
  </span>
</template>
