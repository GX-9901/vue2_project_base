<template>
  <el-select :value="value" :placeholder="placeholder" ref="selectRef">
    <el-option
      :value="value"
      :label="selectedData[defaultProps.label]"
      class="tree-select"
    >
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        :node-key="defaultProps.id"
        :accordion="accordion"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "TreeSelect",
  props: {
    value: {
      type: [Number, String, Object],
      default: "",
    },
    /* 配置选项 */
    defaultProps: {
      type: Object,
      default: () => {
        return {
          id: "id", // ID字段名
          label: "label", // 显示名称
          children: "children", // 子级字段名
        };
      },
    },
    /* 展示数据 */
    treeData: {
      type: Array,
      default: () => [],
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => true,
    },
    /* 提示词 */
    placeholder: {
      type: String,
      default: "请选择",
    },
  },
  data() {
    return {
      selectedData: {},
    };
  },
  methods: {
    handleNodeClick(data) {
      this.selectedData = data;
      this.$emit("input", data[this.defaultProps.id]);
      this.$refs.selectRef.blur();
    },
  },
};
</script>

<style lang="scss">
.tree-select {
  height: auto;
  background-color: #fff;
  padding: 0;

  .is-current .el-tree-node__label {
    color: #409eff;
    font-weight: 700;
  }

  .is-current .el-tree-node__children .el-tree-node__label {
    color: #606266;
    font-weight: normal;
  }

  .el-tree-node__label {
    font-weight: normal;
  }
}
</style>
