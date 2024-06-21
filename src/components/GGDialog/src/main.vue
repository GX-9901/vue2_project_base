<script>
import svgIcon from "@/components/SvgIcon/index.vue";
export default {
  name: "GGDialog",
  components:{
    svgIcon,
  },
  props:{
    title:{
      type:String,
      default:"",
    },
    visible: {
      type : Boolean,
      required: true,
    }
  },

  data(){
    return{
      isFullScreen: false,
    }
  },
  methods:{
    switchFullScreen(){
      this.isFullScreen = !this.isFullScreen;
    },
    close() {
      this.$emit("update:visible", false);
    },
  },
}
</script>

<template>
<el-dialog :visible="visible"
           class="ggdialog"
           :fullscreen="isFullScreen"
           @update:visible="close"
           v-bind="$attrs"
>
  <template #title>
    <div class="ggdialog-header">
      <span class="ggdialog-title">{{ title }}</span>
      <svgIcon
        :iconClass="isFullScreen ? 'exit-fullscreen' : 'fullscreen'"
        className="ggdialog-icon"
        @click="switchFullScreen" />
    </div>
  </template>
  <slot />
<!--  <template #footer>
    <slot name="footer" />
  </template>-->
  <template #footer>
    <slot name="footer" />
    <el-button size="small" @click="close">取 消</el-button>
  </template>
</el-dialog>
</template>

<style scoped lang="scss">
.ggdialog-header{
  display: flex;
  justify-content: space-between;
  padding-right: 26px;
  align-items: center;
}
.ggdialog-icon{
  color: #909399;
  cursor: pointer;
}

.ggdialog ::v-deep .el-dialog__headerbtn:hover {
  .el-dialog__close{
    color: #909399;
  }
}
.ggdialog ::v-deep .el-dialog__headerbtn:focus {
  .el-dialog__close{
    color: #909399;
  }
}
.ggdialog ::v-deep .el-dialog__close:hover {
  color: #909399;
}
.ggdialog ::v-deep .el-dialog__close:focus {
  color: #909399;
}
.ggdialog ::v-deep .el-dialog__header {
  position: relative;
  padding: 15px 20px;
  border-bottom: 1px solid #dcdfe6;
}
.ggdialog ::v-deep .el-dialog__headerbtn{
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  .el-dialog__close{
    font-size: 20px;
  }
}
.ggdialog ::v-deep .el-dialog__footer{
  padding: 10px 20px;
  border-top: 1px solid #dcdfe6;
}
.ggdialog ::v-deep .el-dialog{
  max-width:100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}
.ggdialog ::v-deep .el-dialog__body{
  flex: 1;
}
</style>
