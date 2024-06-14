<template>
  <Dialog :visible.sync="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="图标地址" prop="picUrl">
        <ImageUpload v-model="formData.picUrl" height="80px" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="formData.sort"
          :min="0"
          clearable
          controls-position="right"
        />
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
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import * as ArticleCategoryApi from "@/api/mall/promotion/articleCategory";
import { CommonStatusEnum } from "@/utils/constants";
import ImageUpload from "@/components/ImageUpload";

export default {
  name: "PromotionArticleCategoryForm",
  components: {
    ImageUpload,
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: "",
      formLoading: false,
      formType: "",
      formData: {
        id: undefined,
        name: undefined,
        picUrl: undefined,
        status: undefined,
        sort: undefined,
      },
      formRules: {
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
      },
      CommonStatusEnum,
    };
  },
  methods: {
    getIntDictOptions,
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
          const { data } = await ArticleCategoryApi.getArticleCategory(id);
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
          await ArticleCategoryApi.createArticleCategory(data);
          this.$message.success("添加成功");
        } else {
          await ArticleCategoryApi.updateArticleCategory(data);
          this.$message.success("修改成功");
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
        picUrl: undefined,
        status: CommonStatusEnum.ENABLE,
        sort: 0,
      };
      this.$refs.formRef?.resetFields();
    },
  },
};
</script>
