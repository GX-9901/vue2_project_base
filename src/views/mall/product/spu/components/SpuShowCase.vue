<template>
  <div>
    <div class="spu-uploader">
      <div class="spu-upload">
        <el-tooltip
          v-if="spuPicUrl"
          effect="dark"
          :content="spuName"
          placement="bottom"
        >
          <img :src="spuPicUrl" class="avatar" />
        </el-tooltip>
        <el-tooltip v-else effect="dark" content="选择商品" placement="bottom">
          <i
            class="el-icon-plus avatar-uploader-icon"
            @click="showSpuTableSelect"
          ></i>
        </el-tooltip>
        <i class="el-icon-error" v-if="spuPicUrl" @click="del"></i>
      </div>
    </div>

    <SpuTableSelect ref="spuTableSelectRef" @success="success" />
  </div>
</template>

<script>
import SpuTableSelect from "./SpuTableSelect";

export default {
  name: "SpuShowCase",
  components: {
    SpuTableSelect,
  },
  data() {
    return {
      spuPicUrl: "",
      spuName: "",
    };
  },
  methods: {
    success(val) {
      this.spuName = val.name;
      this.spuPicUrl = val.picUrl;
      this.$emit("success", val.id);
    },
    showSpuTableSelect() {
      this.$refs.spuTableSelectRef.open();
    },
    del() {
      this.spuPicUrl = "";
      this.spuName = "";
      this.$emit("success", undefined);
    },
  },
};
</script>

<style scoped lang="scss">
.spu-uploader .spu-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  display: inline-block;
}
.spu-uploader .spu-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 16px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.avatar {
  width: 60px;
  height: 60px;
  display: block;
}

.el-icon-error {
  position: absolute;
  right: -5px;
  top: -5px;
}
</style>
