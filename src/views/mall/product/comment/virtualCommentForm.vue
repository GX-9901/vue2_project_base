<script>
export default {
  name: "VirtualCommentForm",
  data() {
    return {
      visible: true,
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
};
</script>

<template>
  <GGDialog
    :visible.sync="visible"
    title="添加虚拟评论"
    width="500px"
    :close-on-click-modal="true"
  >
    <el-form label-width="80px">
      <el-form-item label="商品">xxx</el-form-item>
      <el-form-item label="用户头像">xxx</el-form-item>
      <el-form-item label="用户名称">
        <el-input placeholder="请输入用户名称"></el-input>
      </el-form-item>
      <el-form-item label="评论内容">
        <el-input placeholder="请输入评论内容" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="描述星级">
        <el-rate></el-rate>
      </el-form-item>
      <el-form-item label="服务星级">
        <el-rate></el-rate>
      </el-form-item>
      <el-form-item label="评论图片">xxx</el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" size="small">确定</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </template>
  </GGDialog>
</template>

<style scoped lang="scss">

</style>
