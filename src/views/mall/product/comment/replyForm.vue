<script>

export default {
  name: "ReplyForm",
  data(){
    return{
      visible: true,
    }
  },
  methods: {
    close() {
      this.visible = false;
    },
  },
}
</script>

<template>
<GGDialog title="回复评论" :visible="visible">
  <el-form>
    <el-form-item label="回复内容">
      <el-input type="textarea" :rows="4" placeholder="请输入回复内容"></el-input>
    </el-form-item>
  </el-form>
  <template #footer>
    <el-button type="primary" size="small">确 定</el-button>
    <el-button size="small" @click="close">取 消</el-button>
  </template>
</GGDialog>
</template>

<style scoped>

</style>
