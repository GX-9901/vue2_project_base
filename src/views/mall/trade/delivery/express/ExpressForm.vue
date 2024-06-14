<template>
  <Dialog :title="dialogTitle" :visible.sync="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-form-item label="公司编码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入快递编码" />
      </el-form-item>
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入快递名称" />
      </el-form-item>
      <el-form-item label="公司 logo" prop="logo">
        <ImageUpload v-model="formData.logo" :limit="1" :is-show-tip="false" />
        <TipText size="small"> 推荐 180x180 图片分辨率 </TipText>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="formData.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="开启状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in commonStatus"
            :key="dict.value"
            :label="+dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script>
import { CommonStatusEnum } from "@/utils/constants";
import * as DeliveryExpressApi from "@/api/mall/trade/delivery/express";
import ImageUpload from "@/components/ImageUpload";
import { TipText } from "@/components/TipText";

export default {
  name: "ExpressForm",
  components: {
    ImageUpload,
    TipText,
  },
  data() {
    return {
      dialogVisible: false, // 弹窗的是否展示
      dialogTitle: "", // 弹窗的标题
      formLoading: false, // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formType: "", // // 表单的类型：create - 新增；update - 修改
      formData: {
        id: undefined,
        code: "",
        name: "",
        logo: "",
        sort: 0,
        status: "",
      },
      formRules: {
        code: [
          { required: true, message: "快递编码不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        logo: [
          { required: true, message: "分类图片不能为空", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "分类排序不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "开启状态不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /** 打开弹窗 */
    async open(type, id) {
      this.dialogVisible = true;
      this.dialogTitle = type === "create" ? "创建" : "更新";
      this.formType = type;
      this.resetForm();
      // 修改时，设置数据
      if (id) {
        this.formLoading = true;
        try {
          const { data } = await DeliveryExpressApi.getDeliveryExpress(id);
          this.formData = data;
        } finally {
          this.formLoading = false;
        }
      }
    },
    submitForm() {
      // 校验表单
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) return;
        // 提交请求
        this.formLoading = true;
        try {
          const data = this.formData;
          if (this.formType === "create") {
            await DeliveryExpressApi.createDeliveryExpress(data);
            this.$message.success("创建成功");
          } else {
            await DeliveryExpressApi.updateDeliveryExpress(data);
            this.$message.success("更新成功");
          }
          this.dialogVisible = false;
          // 发送操作成功的事件
          this.$emit("success");
        } finally {
          this.formLoading = false;
        }
      });
    },
    /** 重置表单 */
    resetForm() {
      this.formData = {
        id: undefined,
        name: "",
        picUrl: "",
        status: CommonStatusEnum.ENABLE,
      };
      this.$refs.formRef?.resetFields();
    },
  },
  computed: {
    commonStatus() {
      return this.$store.state.dict.dictDatas.common_status;
    },
  },
};
</script>
