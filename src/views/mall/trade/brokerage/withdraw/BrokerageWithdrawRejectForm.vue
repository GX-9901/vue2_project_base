<template>
  <Dialog title="审核" :visible.sync="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="驳回原因" prop="auditReason">
        <el-input
          v-model="formData.auditReason"
          type="textarea"
          placeholder="请输入驳回原因"
        />
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
import * as BrokerageWithdrawApi from "@/api/mall/trade/brokerage/withdraw";

export default {
  name: "BrokerageWithdrawRejectForm",
  data() {
    return {
      dialogVisible: false, // 弹窗的是否展示
      formLoading: false, // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formData: {
        id: undefined,
        auditReason: undefined,
      },
      formRules: {
        auditReason: [
          { required: true, message: "驳回原因不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /** 打开弹窗 */
    open(id) {
      this.dialogVisible = true;
      this.resetForm();
      this.formData.id = id;
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
        const { data } = this.formData;
        await BrokerageWithdrawApi.rejectBrokerageWithdraw(data);
        this.$message.success("驳回成功");
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
        auditReason: undefined,
      };
      this.$refs.formRef?.resetFields();
    },
  },
};
</script>
