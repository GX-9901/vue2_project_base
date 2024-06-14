<template>
  <el-card shadow="never">
    <template #header>
      <CardTitle title="运营数据" />
    </template>
    <div class="menu-list">
      <div
        v-for="item in data"
        :key="item.name"
        class="menu-item"
        @click="handleClick(item.routerName)"
      >
        <CountTo
          :prefix="item.prefix"
          :end-val="item.value"
          :decimals="item.decimals"
          class="menu-value"
        />
        <span class="menu-name">{{ item.name }}</span>
      </div>
    </div>
  </el-card>
</template>
<script>
import * as ProductSpuApi from "@/api/mall/product/spu";
import * as TradeStatisticsApi from "@/api/mall/statistics/trade";
import * as PayStatisticsApi from "@/api/mall/statistics/pay";
import { CardTitle } from "@/components/Card";
import { CountTo } from "@/components/CountTo";

export default {
  name: "OperationDataCard",
  components: {
    CountTo,
    CardTitle,
  },
  data() {
    return {
      data: {
        orderUndelivered: {
          name: "待发货订单",
          value: 9,
          routerName: "TradeOrder",
        },
        orderAfterSaleApply: {
          name: "退款中订单",
          value: 4,
          routerName: "TradeAfterSale",
        },
        orderWaitePickUp: {
          name: "待核销订单",
          value: 0,
          routerName: "TradeOrder",
        },
        productAlertStock: {
          name: "库存预警",
          value: 0,
          routerName: "ProductSpu",
        },
        productForSale: {
          name: "上架商品",
          value: 0,
          routerName: "ProductSpu",
        },
        productInWarehouse: {
          name: "仓库商品",
          value: 0,
          routerName: "ProductSpu",
        },
        withdrawAuditing: {
          name: "提现待审核",
          value: 0,
          routerName: "TradeBrokerageWithdraw",
        },
        rechargePrice: {
          name: "账户充值",
          value: 0.0,
          prefix: "￥",
          decimals: 2,
          routerName: "PayWalletRecharge",
        },
      },
    };
  },
  methods: {
    /** 查询订单数据 */
    async getOrderData() {
      const { data: orderCount } = await TradeStatisticsApi.getOrderCount();
      this.data.orderUndelivered.value = orderCount.undelivered;
      this.data.orderAfterSaleApply.value = orderCount.afterSaleApply;
      this.data.orderWaitePickUp.value = orderCount.pickUp;
      this.data.withdrawAuditing.value = orderCount.auditingWithdraw;
    },

    /** 查询商品数据 */
    async getProductData() {
      // TODO：这个接口的返回值，是不是用命名字段更好些？
      const { data: productCount } = await ProductSpuApi.getTabsCount();
      this.data.productForSale.value = productCount["0"];
      this.data.productInWarehouse.value = productCount["1"];
      this.data.productAlertStock.value = productCount["3"];
    },

    /** 查询钱包充值数据 */
    async getWalletRechargeData() {
      const { data: paySummary } =
        await PayStatisticsApi.getWalletRechargePrice();
      this.data.rechargePrice.value = paySummary.rechargePrice;
    },

    /**
     * 跳转到对应页面
     *
     * @param routerName 路由页面组件的名称
     */
    handleClick(routerName) {
      this.$router.push({ name: routerName });
    },
  },
  mounted() {
    this.getOrderData();
    this.getProductData();
    this.getWalletRechargeData();
  },
};
</script>

<style scoped lang="scss">
.menu-list {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  height: 250px;
  align-items: center;
}

.menu-item {
  width: 25%;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.menu-value {
  font-size: 30px;
}

.menu-name {
  font-size: 16px;
  margin-top: 10px;
}
</style>
