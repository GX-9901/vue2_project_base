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
    },
    value: {
      type: [String, Number, Object],
      required: true
    }
  },
  data(){
    return {
      selectedGood:this.value,
    }
  },
  methods: {
    handleNodeClick(data) {
      this.selectedGood = data
      this.$refs.selectedGoodRef.blur()
      this.$emit('input', data);
    }
  },
}
</script>

<template>
    <el-select
      placeholder="请选择"
      popper-class="select-tree"
      :value="selectedGood[defaultProps.label]"
      ref="selectedGoodRef"
    >
      <el-option value="">
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
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #fff;
  color: #409eff;
  font-weight: 700;
}
</style>
