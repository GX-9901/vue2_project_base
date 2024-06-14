<template>
  <el-card shadow="never">
    <template #header>
      <CardTitle title="快捷入口" />
    </template>
    <div class="menu-list">
      <div
        v-for="menu in menuList"
        :key="menu.name"
        @click="handleMenuClick(menu.routerName)"
        class="menu-item"
      >
        <div :class="['menu-icon']" :style="{ backgroundColor: menu.bgColor }">
          <i :class="menu.icon" />
        </div>
        <span class="menu-name">{{ menu.name }}</span>
      </div>
    </div>
  </el-card>
</template>
<script>
/** 快捷入口卡片 */
import { CardTitle } from "@/components/Card";

export default {
  name: "ShortcutCard",
  components: {
    CardTitle,
  },
  data() {
    return {
      /** 菜单列表 */
      menuList: [
        {
          name: "用户管理",
          icon: "el-icon-user",
          bgColor: "rgb(248, 113, 113)",
          routerName: "MemberUser",
        },
        {
          name: "商品管理",
          icon: "el-icon-box",
          bgColor: "rgb(251, 146, 60)",
          routerName: "ProductSpu",
        },
        {
          name: "订单管理",
          icon: "el-icon-tickets",
          bgColor: "rgb(234, 179, 8)",
          routerName: "TradeOrder",
        },
        {
          name: "售后管理",
          icon: "el-icon-service",
          bgColor: "rgb(22, 163, 74)",
          routerName: "TradeAfterSale",
        },
        {
          name: "分销管理",
          icon: "el-icon-position",
          bgColor: "rgb(6, 182, 212)",
          routerName: "TradeBrokerageUser",
        },
        {
          name: "优惠券",
          icon: "el-icon-discount",
          bgColor: "rgb(59, 130, 246)",
          routerName: "PromotionCoupon",
        },
        {
          name: "拼团活动",
          icon: "el-icon-dish",
          bgColor: "rgb(168, 85, 247)",
          routerName: "PromotionBargainActivity",
        },
        {
          name: "佣金提现",
          icon: "el-icon-money",
          bgColor: "rgb(244, 63, 94)",
          routerName: "TradeBrokerageWithdraw",
        },
      ],
    };
  },
  methods: {
    /**
     * 跳转到菜单对应页面
     *
     * @param routerName 路由页面组件的名称
     */
    handleMenuClick(routerName) {
      this.$router.push({ name: routerName });
    },
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

.menu-icon {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  i {
    font-size: 30px;
    color: #fff;
  }
}

.menu-name {
  font-size: 16px;
  margin-top: 10px;
}
</style>
