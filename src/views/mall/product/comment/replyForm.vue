<script>
import {createCommentBrand} from "@/api/mall/product/comment";
export default {
  name: "ReplyForm",
  data(){
    return{
      visible: false,
      commentForm: {
        replyContent: '',
        id:''
      },
      commentRules:{
        replyContent: [
          { required: true, message: '请输入回复内容', trigger: 'blur' },]
      }
    }
  },
  methods:{
    submit(){
      this.$refs.commentFormRef.validate(async valid =>{
        if(valid){
          await createCommentBrand(this.commentForm);
          this.$message({
            type: 'success',
            message: '回复评论成功'
          });
          this.visible = false;

          this.$emit('success');
        }
      });
    },
    open() {
      this.commentForm = {
        replyContent: '',
        id: ''
      };
      this.$refs.commentFormRef?.clearValidate();
      this.visible = true;

    },
  },


  /*  methods: {

      close() {
        this.visible = false;
      },
    },*/
}
</script>

<template>
<GGDialog title="回复评论" :visible.sync="visible" ref="ggDialog" width="500px">
  <el-form
    :rules="commentRules"
    :model="commentForm"
    ref="commentFormRef"
  >
    <el-form-item label="回复内容" prop="replyContent">
      <el-input type="textarea" :rows="4" placeholder="请输入回复内容" v-model="commentForm.replyContent"></el-input>
    </el-form-item>
  </el-form>
  <template #footer>
    <el-button type="primary" size="small" @click="submit">确 定</el-button>
<!--    <el-button size="small" @click="close">取 消</el-button>-->
  </template>
</GGDialog>
</template>

<style scoped>

</style>
