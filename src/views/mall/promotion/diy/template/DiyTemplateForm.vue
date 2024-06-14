<template>
  <Dialog :visible.sync="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入模板名称" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          placeholder="请输入备注"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="预览图" prop="previewPicUrls">
        <UploadImgs v-model="formData.previewPicUrls" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script>
import * as DiyTemplateApi from "@/api/mall/promotion/diy/template";

/** 装修模板表单 */
export default {
  name: "DiyTemplateForm",
  data() {
    return {
      dialogVisible: false,
      dialogTitle: "",
      formLoading: false,
      formType: "",
      formData: {
        id: undefined,
        name: undefined,
        remark: undefined,
        previewPicUrls: [],
      },
      formRules: {
        name: [
          { required: true, message: "模板名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /** 打开弹窗 */
    async open(type, id) {
      this.dialogVisible = true;
      this.dialogTitle = type === "create" ? "添加" : "修改";
      this.formType = type;
      this.resetForm();
      // 修改时，设置数据
      if (id) {
        this.formLoading = true;
        try {
          const { data } = await DiyTemplateApi.getDiyTemplate(id);
          this.formData = data;
        } finally {
          this.formLoading = false;
        }
      }
    },
    /** 提交表单 */
    async submitForm() {
      // 校验表单
      if (!this.$refs.formRef) return;
      const valid = await this.$refs.formRef.validate();
      if (!valid) return;
      // 提交请求
      this.formLoading = true;
      try {
        const data = this.formData;
        if (this.formType === "create") {
          await DiyTemplateApi.createDiyTemplate(data);
          this.$message.success("添加成功");
        } else {
          await DiyTemplateApi.updateDiyTemplate(data);
          this.$message.success("更新成功");
        }
        this.dialogVisible = false;
        // 发送操作成功的事件
        this.$emit("success");
      } finally {
        this.formLoading = false;
      }
    },
    /** 重置表单 */
    resetForm() {
      this.formData = {
        id: undefined,
        name: undefined,
        remark: undefined,
        previewPicUrls: [],
      };
      this.$refs.formRef?.resetFields();
    },
  },
};
</script>
