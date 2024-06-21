<script>
export default {
  name: "GGTreeSelect",
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'label'
      })

    }
  },
  data(){
    return {
      selectedGood: ''
    }
  },
  methods: {
    handleNodeClick(data) {
      this.selectedGood = data.name
      this.$refs.selectedGoodRef.blur()
    }
  },
}
</script>

<template>
    <el-select
      placeholder="请选择"
      popper-class="select-tree"
      :value="selectedGood"
      ref="selectedGoodRef"
    >
      <el-option>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          @node-click="handleNodeClick"
          highlight-current
          :expand-on-click-node="false"
        >

        </el-tree>
      </el-option>
    </el-select>
</template>

<style lang="scss">
.select-tree .el-select-dropdown__item {
  height: auto !important;
  background-color: #fff !important;
  padding: 0 !important;
  font-weight: normal !important;
}
</style>
