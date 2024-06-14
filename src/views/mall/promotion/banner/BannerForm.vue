<template>
  <Dialog :visible.sync="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="标题" prop="title">
            <el-input
              v-model="formData.title"
              placeholder="请输入 Banner 标题"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图片" prop="picUrl">
            <UploadImg v-model="formData.picUrl" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="跳转地址" prop="url">
            <el-input v-model="formData.url" placeholder="请输入跳转地址" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="formData.sort"
              :min="0"
              clearable
              controls-position="right"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
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
        </el-col>
        <el-col :span="24">
          <el-form-item label="位置" prop="position">
            <el-radio-group v-model="formData.position">
              <el-radio
                v-for="dict in getIntDictOptions(
                  DICT_TYPE.PROMOTION_BANNER_POSITION,
                )"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="memo">
            <el-input
              v-model="formData.memo"
              placeholder="请输入描述"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
import * as BannerApi from "@/api/mall/market/banner";

export default {
  name: "BannerForm",
  data() {
    return {
      dialogVisible: false,
      dialogTitle: "",
      formLoading: false,
      formType: "",
      formData: {
        id: undefined,
        title: undefined,
        picUrl: undefined,
        status: 0,
        position: 1,
        url: undefined,
        sort: 0,
        memo: undefined,
      },
      formRules: {
        title: [
          { required: true, message: "Banner 标题不能为空", trigger: "blur" },
        ],
        picUrl: [
          { required: true, message: "图片 URL 不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "活动状态不能为空", trigger: "blur" },
        ],
        position: [
          { required: true, message: "位置不能为空", trigger: "blur" },
        ],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        url: [{ required: true, message: "跳转地址不能为空", trigger: "blur" }],
      },
      DICT_TYPE,
    };
  },
  methods: {
    getIntDictOptions,
    /** 打开弹窗 */
    async open(type, id) {
      this.dialogVisible = true;
      this.dialogTitle = type === "create" ? "新增" : "修改";
      this.formType = type;
      this.resetForm();
      // 修改时，设置数据
      if (id) {
        this.formLoading = true;
        try {
          const { data } = await BannerApi.getBanner(id);
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
        const data = formData;
        if (this.formType === "create") {
          await BannerApi.createBanner(data);
          this.$message.success("添加成功");
        } else {
          await BannerApi.updateBanner(data);
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
        title: undefined,
        picUrl: undefined,
        status: 0,
        position: 1,
        url: undefined,
        sort: 0,
        memo: undefined,
      };
      this.$refs.formRef?.resetFields();
    },
  },
};
</script>
