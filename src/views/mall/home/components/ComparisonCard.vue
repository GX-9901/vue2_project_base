<template>
  <div class="comparison-card">
    <div class="comparison-card-header">
      <span class="comparison-card-title">{{ title }}</span>
      <el-tag>{{ tag }}</el-tag>
    </div>
    <div class="comparison-card-content">
      <CountTo
        :prefix="prefix"
        :end-val="value"
        :decimals="decimals"
        class="comparison-card-text"
      />
      <span :class="toNumber(percent) > 0 ? 'text-red' : 'text-green'">
        {{ toNumber(percent) }}%
        <i
          :class="
            toNumber(percent) > 0 ? 'el-icon-caret-top' : 'el-icon-caret-bottom'
          "
        />
      </span>
    </div>
    <el-divider class="comparison-divider" />
    <div class="comparison-card-footer">
      <span class="comparison-card-title">昨日数据</span>
      <span>{{ prefix || "" }}{{ reference }}</span>
    </div>
  </div>
</template>
<script>
import { CountTo } from "@/components/CountTo";
import { calculateRelativeRate } from "@/utils";

export default {
  name: "ComparisonCard",
  components: {
    CountTo,
  },
  props: {
    title: String,
    tag: String,
    prefix: String,
    value: Number,
    reference: Number,
    decimals: Number,
  },
  computed: {
    percent() {
      return calculateRelativeRate(this.value, this.reference);
    },
  },
  methods: {
    toNumber(percent) {
      return percent;
    },
  },
};
</script>

<style scoped lang="scss">
/* flex flex-col gap-2 bg-[var(--el-bg-color-overlay)] p-6 */
.comparison-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  font-size: 16px;
}

.comparison-card-header,
.comparison-card-content,
.comparison-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comparison-card-title {
  color: rgb(107, 114, 128);
}

.comparison-card-footer .comparison-card-title {
  font-size: 14px;
}

.comparison-card-text {
  font-size: 30px;
}

.text-red {
  color: rgb(34, 197, 94);
}
.text-green {
  color: rgb(34, 197, 94);
}
.comparison-divider {
  margin: 10px 0;
}
</style>
