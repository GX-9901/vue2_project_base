<template>
  <div>
    <!-- 核销对话框 -->
    <Dialog :visible.sync="dialogVisible" title="订单核销" width="35%">
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item prop="pickUpVerifyCode" label="核销码">
          <el-input
            v-model="formData.pickUpVerifyCode"
            placeholder="请输入核销码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          :disabled="formLoading"
          @click="getOrderByPickUpVerifyCode"
        >
          查询
        </el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </Dialog>
    <!-- 核销确认对话框 -->
    <Dialog :visible.sync="detailDialogVisible" title="订单详情" width="55%">
      <TradeOrderDetail
        v-if="orderDetails.id"
        :id="orderDetails.id"
        :show-pick-up="false"
      />
      <template #footer>
        <el-button type="primary" :disabled="formLoading" @click="submitForm">
          确认核销
        </el-button>
        <el-button @click="detailDialogVisible = false">取 消</el-button>
      </template>
    </Dialog>
  </div>
</template>
<script>
import * as TradeOrderApi from "@/api/mall/trade/order";
import { DeliveryTypeEnum, TradeOrderStatusEnum } from "@/utils/constants";
import TradeOrderDetail from "@/views/mall/trade/order/detail";

/** 订单核销表单 */
export default {
  name: "OrderPickUpForm",
  components: {
    TradeOrderDetail,
  },
  data() {
    return {
      dialogVisible: false, // 弹窗的是否展示
      detailDialogVisible: false, // 详情弹窗的是否展示
      formLoading: false, // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formRules: {
        pickUpVerifyCode: [
          { required: true, message: "核销码不能为空", trigger: "blur" },
        ],
      },
      formData: {
        pickUpVerifyCode: "", // 核销码
      },
      orderDetails: {},
    };
  },
  methods: {
    /** 打开弹窗 */
    async open() {
      this.resetForm();
      this.dialogVisible = true;
    },
    // 提交表单
    async submitForm() {
      // 提交请求
      this.formLoading = true;
      try {
        await TradeOrderApi.pickUpOrderByVerifyCode(
          this.formData.pickUpVerifyCode,
        );
        this.$message.success("核销成功");
        this.detailDialogVisible = false;
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
        pickUpVerifyCode: "", // 核销码
      };
      this.$refs.formRef?.resetFields();
    },
    /** 查询核销码对应的订单 */
    async getOrderByPickUpVerifyCode() {
      // 校验表单
      if (!this.$refs.formRef) return;
      const valid = await this.$refs.formRef.validate();
      if (!valid) return;

      this.formLoading = true;
      const { data } = await TradeOrderApi.getOrderByPickUpVerifyCode(
        this.formData.pickUpVerifyCode,
      );
      this.formLoading = false;
      if (data?.deliveryType !== DeliveryTypeEnum.PICK_UP.type) {
        this.$message.error("请输入正确的核销码");
        return;
      }
      if (data?.status !== TradeOrderStatusEnum.UNDELIVERED.status) {
        this.$message.error("订单不是待核销状态");
        return;
      }
      this.orderDetails = data;
      // 显示详情对话框
      this.detailDialogVisible = true;
    },
  },
};
</script>
