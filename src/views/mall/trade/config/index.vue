<template>
  <div class="app-container">
    <el-card shadow="never">
      <el-form
        label-width="120px"
        :model="formData"
        :rules="formRules"
        ref="formRef"
      >
        <el-tabs v-model="activeTab">
          <el-tab-pane label="售后" name="afterSales">
            <el-form-item label="退款理由" prop="afterSaleRefundReasons">
              <el-select
                v-model="formData.afterSaleRefundReasons"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请输入退款理由"
                class="select"
              >
                <el-option
                  v-for="(item, index) in formData.afterSaleRefundReasons"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="退货理由" prop="afterSaleReturnReasons">
              <el-select
                v-model="formData.afterSaleReturnReasons"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请输入退货理由"
                class="select"
              >
                <el-option
                  v-for="(item, index) in formData.afterSaleReturnReasons"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="配送" name="delivery">
            <el-form-item label="启用包邮" prop="deliveryExpressFreeEnabled">
              <el-switch v-model="formData.deliveryExpressFreeEnabled">
              </el-switch>
              <TipText size="small">商城是否启用全场包邮</TipText>
            </el-form-item>
            <el-form-item label="满额包邮" prop="deliveryExpressFreePrice">
              <el-input-number
                v-model="formData.deliveryExpressFreePrice"
                :min="0"
              ></el-input-number>
              <TipText size="small">
                商城商品满多少金额即可包邮，单位：元
              </TipText>
            </el-form-item>
            <el-form-item label="启用门店自提" prop="deliveryPickUpEnabled">
              <el-switch v-model="formData.deliveryPickUpEnabled"> </el-switch>
              <TipText size="small">商城是否启用门店自提</TipText>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="分销" name="distribution">
            <el-form-item label="分佣启用" prop="brokerageEnabled">
              <el-switch v-model="formData.brokerageEnabled"> </el-switch>
              <TipText size="small">商城是否开启分销模式</TipText>
            </el-form-item>
            <el-form-item label="分佣模式" prop="brokerageEnabledCondition">
              <el-radio-group v-model="formData.brokerageEnabledCondition">
                <el-radio
                  v-for="item in brokerageCondition"
                  :key="item.value"
                  :label="+item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
              <TipText size="small">人人分销：每个用户都可以成为推广员</TipText>
              <TipText size="small">指定分销：仅可在后台手动设置推广员</TipText>
            </el-form-item>
            <el-form-item label="分销关系绑定" prop="brokerageBindMode">
              <el-radio-group v-model="formData.brokerageBindMode">
                <el-radio
                  v-for="item in brokerageMode"
                  :key="item.value"
                  :label="+item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
              <TipText size="small">
                首次绑定：只要用户没有推广人，随时都可以绑定推广关系
              </TipText>
              <TipText size="small">
                注册绑定：只有新用户注册时或首次进入系统时才可以绑定推广关系
              </TipText>
            </el-form-item>
            <el-form-item label="分销海报图" prop="brokeragePosterUrls">
              <ImageUpload
                v-model="formData.brokeragePosterUrls"
                :isShowTip="false"
              >
              </ImageUpload>
              <TipText size="small">
                个人中心分销海报图片，建议尺寸 600x1000
              </TipText>
            </el-form-item>
            <el-form-item label="一级返佣比例" prop="brokerageFirstPercent">
              <el-input-number
                v-model="formData.brokerageFirstPercent"
                :min="0"
              ></el-input-number>
              <TipText size="small">
                订单交易成功后给推广人返佣的百分比
              </TipText>
            </el-form-item>
            <el-form-item label="二级返佣比例" prop="brokerageSecondPercent">
              <el-input-number
                v-model="formData.brokerageSecondPercent"
                :min="0"
              ></el-input-number>
              <TipText size="small">
                订单交易成功后给推广人的推荐人返佣的百分比
              </TipText>
            </el-form-item>
            <el-form-item label="佣金冻结天数" prop="brokerageFrozenDays">
              <el-input-number
                v-model="formData.brokerageFrozenDays"
                :min="0"
              ></el-input-number>
              <TipText size="small">
                防止用户退款，佣金被提现了，所以需要设置佣金冻结时间，单位：天
              </TipText>
            </el-form-item>
            <el-form-item label="提现最低金额" prop="brokerageWithdrawMinPrice">
              <el-input-number
                v-model="formData.brokerageWithdrawMinPrice"
                :min="0"
              ></el-input-number>
              <TipText size="small"> 用户提现最低金额限制，单位：元 </TipText>
            </el-form-item>
            <el-form-item label="提现手续费" prop="brokerageWithdrawFeePercent">
              <el-input-number
                v-model="formData.brokerageWithdrawFeePercent"
                :min="0"
              ></el-input-number>
              <TipText size="small">
                提现手续费百分比，范围 0-100，0 为无提现手续费。例：设置
                10，即收取 10% 手续费，提现 10 元，到账 9 元，1 元手续费
              </TipText>
            </el-form-item>
            <el-form-item label="提现方式" prop="brokerageWithdrawTypes">
              <el-checkbox-group v-model="formData.brokerageWithdrawTypes">
                <el-checkbox
                  v-for="item in brokerageType"
                  :key="item.value"
                  :label="+item.value"
                >
                  {{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
              <TipText size="small"> 商城开通提现的付款方式 </TipText>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button type="primary" @click="submit" :loading="formLoading"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import * as TradeConfig from "@/api/mall/trade/config";
import { TipText } from "@/components/TipText";
import ImageUpload from "@/components/ImageUpload";

export default {
  name: "TradeConfig",
  components: {
    TipText,
    ImageUpload,
  },
  data() {
    return {
      activeTab: "afterSales",
      formData: {
        afterSaleRefundReasons: [], // 售后的退款理由
        afterSaleReturnReasons: [], // 售后的退货理由
        deliveryExpressFreeEnabled: true, // 是否启用全场包邮
        deliveryExpressFreePrice: 1000, // 全场包邮的最小金额
        deliveryPickUpEnabled: true, // 是否开启自提
        brokerageEnabled: true, // 是否启用分佣
        brokerageEnabledCondition: 0, // 分佣模式
        brokerageBindMode: 0, // 分销关系绑定模式
        brokeragePosterUrls: [], // 分销海报图地址数组
        brokerageFirstPercent: 5, // 一级返佣比例
        brokerageSecondPercent: 5, // 二级返佣比例
        brokerageWithdrawMinPrice: 1000, // 用户提现最低金额
        brokerageWithdrawFeePercent: 1000, // 用户提现手续费百分比
        brokerageFrozenDays: 7, // 佣金冻结时间(天)
        brokerageWithdrawTypes: [0, 1], // 提现方式
        tencentLbsKey: "", // 腾讯地图 KEY
        id: null, // 自增主键
      },
      formRules: {
        deliveryExpressFreePrice: [
          { required: true, message: "满额包邮不能为空", trigger: "blur" },
        ],
        brokerageEnabledCondition: [
          { required: true, message: "分佣模式不能为空", trigger: "blur" },
        ],
        brokerageBindMode: [
          {
            required: true,
            message: "分销关系绑定模式不能为空",
            trigger: "blur",
          },
        ],
        brokerageFirstPercent: [
          { required: true, message: "一级返佣比例不能为空", trigger: "blur" },
        ],
        brokerageSecondPercent: [
          { required: true, message: "二级返佣比例不能为空", trigger: "blur" },
        ],
        brokerageWithdrawMinPrice: [
          {
            required: true,
            message: "用户提现最低金额不能为空",
            trigger: "blur",
          },
        ],
        brokerageWithdrawFeePercent: [
          { required: true, message: "提现手续费不能为空", trigger: "blur" },
        ],
        brokerageFrozenDays: [
          { required: true, message: "佣金冻结时间不能为空", trigger: "blur" },
        ],
        brokerageWithdrawTypes: [
          {
            required: true,
            message: "提现方式不能为空",
            trigger: "change",
          },
        ],
      },
      formLoading: false,
    };
  },
  methods: {
    async getTradeConfig() {
      const res = await TradeConfig.getTradeConfig();
      this.formData = res.data;
      this.formData.brokerageWithdrawMinPrice =
        res.data.brokerageWithdrawMinPrice / 100;
      this.formData.deliveryExpressFreePrice =
        res.data.deliveryExpressFreePrice / 100;
    },
    submit() {
      if (this.formLoading) return;
      this.formLoading = true;
      this.$refs.formRef.validate(async (valid) => {
        if (valid) {
          const formData = { ...this.formData };
          formData.brokerageWithdrawMinPrice =
            formData.brokerageWithdrawMinPrice * 100;
          formData.deliveryExpressFreePrice =
            formData.deliveryExpressFreePrice * 100;
          await TradeConfig.saveTradeConfig(formData);
          this.$message.success("保存成功");
          this.formLoading = false;
        }
      });
    },
  },
  mounted() {
    this.getTradeConfig();
  },
  computed: {
    brokerageCondition() {
      return this.$store.state.dict.dictDatas.brokerage_enabled_condition;
    },
    brokerageMode() {
      return this.$store.state.dict.dictDatas.brokerage_bind_mode;
    },
    brokerageType() {
      return this.$store.state.dict.dictDatas.brokerage_withdraw_type;
    },
  },
};
</script>

<style lang="scss" scoped>
.select {
  width: 100%;
}
</style>
