<template>
  <component :is="render" :class="textKls"><slot /></component>
</template>

<script>
import props from "./props.js";

export default {
  name: "TipText",
  props,
  computed: {
    textKls() {
      return ["el-text", `el-text--${this.size}`];
    },
  },
};
</script>

<style scoped lang="scss">
.el-text {
  --el-text-font-size: 14px;
}

.el-text--small {
  --el-text-font-size: 12px;
}

.el-text--large {
  --el-text-font-size: 18px;
}

.el-text {
  align-self: center;
  margin: 0;
  padding: 0;
  font-size: var(--el-text-font-size);
  color: #909399;
  overflow-wrap: break-word;
}
</style>
