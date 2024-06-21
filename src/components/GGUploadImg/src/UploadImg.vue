<script>
import {getAccessToken} from "@/utils/auth";

export default {
  name: "UploadImg",
  props:{
    value:{
      type: Array,
      default: () => []
    },
    limit:{
      type: Number,
      default: 1
    },
    fileType:{
      type: Array,
      default: () => ["jpg", "jpeg", "png"]
    },
    fileSize:{
      type: Number,
      default: 5
    },
    isShowTips:{
      type: Boolean,
      default: true
    },
    imgTipText:{
      type: String,
      default: "选择图片"
    }
  },
  data(){
    return{
      uploadUrl: process.env.VUE_APP_BASE_API + "/admin-api/infra/file/upload",
      headers:{
        Authorization: "Bearer " + getAccessToken(),
      },
      imgUrl: '',
      imgList:[],
      isShowPreview: false,
    }
  },
  methods:{
    handleSuccess(res, file) {
      if(res.code === 0){
        console.log(res)
        this.imgList.push(file);
      } else {
        this.$message.error(res.msg);
      }
    },
    beforeUpload(file) {
      const isValidType = this.fileType.some((item)=>{
        return  file.type.includes(item);
      });
      // console.log(isValidType);
      const isValidSize = file.size / 1024 / 1024 < this.fileSize;

      if (!isValidType) {
        this.$message.error(`上传头像图片只能是 ${this.fileType.join("/")} 格式!`);
      }
      if (!isValidSize) {
        this.$message.error(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
      }
      return isValidType && isValidSize;
    },
    handlePreview(file){
      this.isShowPreview = true;
      this.imgUrl = file.url;
    },
    handleRemove(file,filelist){
      console.log(filelist);
      this.imgList = [...filelist];
    }
  },
  computed: {
    isShowUploadBtn() {
      return this.imgList.length >= this.limit;
    }
  },
  watch:{
    imgList(imglist){
      this.$emit('input',imglist.map(item => item.response.data));
    }
  },
}
</script>

<template>
  <div>
  <el-upload
    :action="uploadUrl"
    :limit="limit"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    :headers="headers"
    accept="image/png,image/jpeg,image/jpg"
    list-type="picture-card"
    :class="{
      'ggupload': true,
      'ggupload-exceed': isShowUploadBtn
    }"
    :on-preview="handlePreview"
    :on-remove="handleRemove"

  >
    <el-tooltip effect="dark" :content="imgTipText" placement="top">
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-tooltip>
    <template v-if="this.isShowTips">
      <p class="el-upload__tip" slot="tip">请上传 大小不超过 <span class="importantTips">{{fileSize}}MB</span> 格式为 <span class="importantTips">{{ fileType.join("/") }}</span> 的文件</p>
    </template>
  </el-upload>
    <GGDialog
      :visible.sync="isShowPreview"
      title="预览"
      append-to-body
      width="423px"
    >
      <el-image :src="imgUrl" class="preview-img"></el-image>
    </GGDialog>
  </div>
</template>

<style scoped lang="scss">
.ggupload ::v-deep .el-upload--picture-card{
  width: 66px;
  height: 66px;
  position: relative;
}
.ggupload ::v-deep .el-icon-plus{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  height: 100%;
  width: 100%;
}
.ggupload ::v-deep .el-icon-plus:before{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.ggupload-exceed ::v-deep .el-upload--picture-card{
  display: none;
}

.ggupload ::v-deep .el-upload-list__item-thumbnail{
  width: 66px;
  height: 66px;
}
.ggupload ::v-deep .el-upload-list__item-actions{
  width: 66px;
  height: 66px;
}
.ggupload ::v-deep .el-upload-list__item{
  width: 66px;
  height: 66px;
}

</style>
