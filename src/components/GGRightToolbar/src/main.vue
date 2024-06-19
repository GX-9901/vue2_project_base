<script>
import props from "./props";

export default {
  name: "GGRightToolbar",
  props,
  methods:{
    handleSwitch(){
      this.$emit('update:visible', !this.visible)
    },
    handleRefresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<template>
  <el-row :gutter="10">
    <el-tooltip  effect="dark"
                 :content="`${visible ? '隐藏' : '显示'}搜索`"
                 placement="top">
      <el-button size="mini" icon="el-icon-search" circle @click="handleSwitch"></el-button>
    </el-tooltip>
    <el-tooltip  effect="dark" content="刷新" placement="top">
      <el-button size="mini" icon="el-icon-refresh" circle @click="handleRefresh"></el-button>
    </el-tooltip>
  </el-row>
</template>

<style>

</style>
