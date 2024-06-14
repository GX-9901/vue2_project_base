<template>
  <Dialog :visible.sync="dialogVisible" title="修改上级推广人" width="500">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="推广人" prop="bindUserId">
        <el-input
          v-model="formData.bindUserId"
          placeholder="请输入推广员编号"
          v-loading="formLoading"
        >
          <template #append>
            <el-button @click="handleGetUser"
              ><Icon icon="ep:search" class="mr-5px"
            /></el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <!-- 展示上级推广人的信息 -->
    <el-descriptions v-if="bindUser" :column="1" border>
      <el-descriptions-item label="头像">
        <el-avatar :src="bindUser.avatar" />
      </el-descriptions-item>
      <el-descriptions-item label="昵称">{{
        bindUser.nickname
      }}</el-descriptions-item>
      <el-descriptions-item label="推广资格">
        <el-tag v-if="bindUser.brokerageEnabled">有</el-tag>
        <el-tag v-else type="info">无</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="成为推广员的时间">
        {{ formatDate(bindUser.brokerageTime) }}
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">
        确 定
      </el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script>
import * as BrokerageUserApi from "@/api/mall/trade/brokerage/user";
import { formatDate } from "@/utils/formatTime";

/** 修改上级推广人表单 */
export default {
  name: "UpdateBindUserForm",
  data() {
    return {
      dialogVisible: false,
      formLoading: false,
      formData: {},
      formRules: {
        bindUserId: [
          { required: true, message: "推广员人不能为空", trigger: "blur" },
        ],
      },
      bindUser: undefined,
    };
  },
  methods: {
    formatDate,
    /** 打开弹窗 */
    async open(row) {
      this.resetForm();
      // 设置数据
      this.formData.id = row.id;
      this.formData.bindUserId = row.bindUserId;
      // 反显上级推广人
      if (row.bindUserId) {
        await this.handleGetUser();
      }
      this.dialogVisible = true;
    },
    /** 提交表单 */
    /** 修改上级推广人 */
    async submitForm() {
      if (this.formLoading) return;
      // 校验表单
      if (!this.$refs.formRef) return;
      const valid = await this.$refs.formRef.validate();
      if (!valid) return;
      // 未查找到合适的上级
      if (!this.bindUser) {
        this.$message.error("请先查询并确认推广人");
        return;
      }

      // 提交请求
      this.formLoading = true;
      try {
        // 发起修改
        await BrokerageUserApi.updateBindUser(this.formData);
        this.$message.success("更新成功");
        this.dialogVisible = false;
        // 发送操作成功的事件
        this.$emit("success", true);
      } finally {
        this.formLoading = false;
      }
    },
    /** 重置表单 */
    resetForm() {
      this.formData = {
        id: 0,
        bindUserId: undefined,
      };
      this.$refs.formRef?.resetFields();
      this.bindUser = undefined;
    },
    /** 查询推广员 */
    async handleGetUser() {
      if (this.formData.bindUserId == this.formData.id) {
        this.$message.error("不能绑定自己为推广人");
        return;
      }
      this.formLoading = true;
      this.bindUser = await BrokerageUserApi.getBrokerageUser(
        this.formData.bindUserId,
      );
      if (!this.bindUser) {
        this.$message.warning("推广员不存在");
      }
      this.formLoading = false;
    },
  },
};
</script>
