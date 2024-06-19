<script>

export default {
  name: "GGDialog",
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
    }
  },
}
</script>

<template>
<el-dialog :visible="visible" class="ggdialog">
  <template #title>
    <div class="ggdialog-header">
      <span class="ggdialog-title">{{ title }}</span>
    </div>
  </template>
</el-dialog>
</template>

<style >

</style>
