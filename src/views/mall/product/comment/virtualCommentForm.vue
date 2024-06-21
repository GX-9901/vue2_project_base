<script>
import SkuSelectForm from "@/views/mall/product/comment/skuSelectForm.vue";
export default {
  name: "VirtualCommentForm",
  data() {
    return {
      visible: false,
      picUrls: [],
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    showSkuSelectForm() {
      this.$refs.skuSelectFormRef.open();
    },
  },
  components: {
    SkuSelectForm,
  },
};
</script>

<template>
  <div>
    <GGDialog
      :visible.sync="visible"
      title="添加虚拟评论"
      width="500px"
      :close-on-click-modal="true"

    >
      <el-form
        label-width="80px"
        class="virtualcommentform"
      >
        <el-form-item label="商品">
          <el-tooltip content="选择商品">
            <div
              class="el-upload el-upload--picture-card"
              @click="showSkuSelectForm"
            >
              <i class="el-icon-plus"></i>
            </div>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="用户头像">
          <UploadImg  :limit="1"/>
        </el-form-item>
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
        <el-form-item label="评论图片">
          <UploadImg  :limit="5" v-model="picUrls"/>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="primary" size="small">确定</el-button>
      </template>
    </GGDialog>
    <SkuSelectForm ref="skuSelectFormRef" >

    </SkuSelectForm>
  </div>
</template>

<style scoped lang="scss">
.virtualcommentform ::v-deep .el-upload--picture-card{
  width: 66px;
  height: 66px;
  position: relative;
}
.virtualcommentform ::v-deep .el-icon-plus{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  height: 100%;
  width: 100%;
}
.virtualcommentform ::v-deep .el-icon-plus:before{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>
