<script>
import { getAccessToken } from "@/utils/auth";
import { createProductBrand , updateProductBrand} from "@/api/mall/product/brand";
export default {
  name: "UpdateForm",
  data() {
    return {
      dialogVisible: false,
      updateFormData:{
        name: '',
        picUrl: '',
        sort: 0,
        description: '',
        status: 0
      },
      imgurl: process.env.VUE_APP_BASE_API + "/admin-api/infra/file/upload",
      headers:{
        Authorization: "Bearer " + getAccessToken(),
      },
      brandFormRules: {
        name: [
          { required: true, message: "品牌名称不能为空", trigger: "blur" },
        ],
        picUrl: [
          { required: true, message: "图片名称不能为空", trigger: "change" },
        ],
        sort: [
          { required: true, message: "品牌排序为数字且不能为空", trigger: "blur" , type: 'number'},
        ],
        status: [
          { required: true, message: "品牌状态不能为空", trigger: "change" },
        ],
      },
    };
  },
  methods: {

    submit(){
      this.$refs.brandForm.validate(async valid => {
        if (valid) {
          if (!!this.updateFormData.id) {
            await updateProductBrand(this.updateFormData);
            this.$message.success("修改品牌成功");
            this.dialogVisible = false;
            this.$emit('success');
          } else {
            await createProductBrand(this.updateFormData);
            this.$message.success("添加品牌成功");
            this.dialogVisible = false;
            this.$emit('success');
          }
        }
      });
    },
    handleAvatarSuccess(res, file) {
      if(res.code ===0){
        this.updateFormData.picUrl = res.data;
        this.$refs.brandForm.clearValidate(['picUrl']);
        console.log(this.updateFormData.picUrl)
      } else {
        this.$message.error(res.msg);
      }
    },
    beforeAvatarUpload(file) {
      const isImg = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png');
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isImg) {
        this.$message.error('上传头像图片只能是 JPG、PNG、JPEG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!');
      }
      return isImg && isLt2M;
    },
    open(){
      this.updateFormData = {
        name: '',
        picUrl: '',
        sort: 0,
        description: '',
        status: 0
      };
      this.dialogVisible = true;
      this.$refs.brandForm?.clearValidate();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  },
/*  computed:{
    isUpdateForm(){
      return !!this.updateFormData.id ? '修改' : '添加';
    }

  }*/
};
</script>

<template>
<div>
  <el-dialog
    :title="`${!!this.updateFormData.id ? '修改':'添加'}品牌`"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose">
  <el-form label-width="80px" :model="updateFormData" :rules="brandFormRules" ref="brandForm">
    <el-form-item label="品牌名称" prop="name">
      <el-input  placeholder="请输入品牌名称" v-model="updateFormData.name" ></el-input>
    </el-form-item>
    <el-form-item label="品牌图片" prop="picUrl">
      <el-upload
        class="avatar-uploader"
        :action="imgurl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :headers="headers"
        accept="image/png,image/jpeg,image/jpg"
      >
        <img v-if="updateFormData.picUrl" :src="updateFormData.picUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <template>
          <p class="el-upload__tip" slot="tip">请上传 大小不超过 <span class="importantTips">5MB</span> 格式为 <span class="importantTips">png/jpg/jpeg</span> 的文件</p>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item label="品牌排序" prop="sort">
      <el-input  placeholder="0" v-model="updateFormData.sort"></el-input>
    </el-form-item>
    <el-form-item label="品牌描述" prop="description">
      <el-input type="textarea" placeholder="请输入品牌描述" v-model="updateFormData.description"></el-input>
    </el-form-item>
    <el-form-item label="状态" prop="status">

        <el-radio :label="0" v-model="updateFormData.status">开启</el-radio>
        <el-radio :label="1" v-model="updateFormData.status">关闭</el-radio>

    </el-form-item>
  </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submit">确 定</el-button>
    <el-button @click="dialogVisible = false">取 消</el-button>

  </span>
  </el-dialog>
  </div>
</template>

<style scoped >
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader >>> .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
.importantTips{
  color: red;
  font-weight: bold;
}
</style>
