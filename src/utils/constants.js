/**
 * 枚举类
 */
import { beginOfDay, endOfDay } from "@/utils/dateUtils";

export const datePickerOptions = {
  shortcuts: [
    {
      text: "最近一周",
      onClick(picker) {
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        const end = new Date();
        picker.$emit("pick", [beginOfDay(start), endOfDay(end)]);
      },
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        const end = new Date();
        picker.$emit("pick", [beginOfDay(start), endOfDay(end)]);
      },
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        const end = new Date();
        picker.$emit("pick", [beginOfDay(start), endOfDay(end)]);
      },
    },
  ],
};

// ========== 静态变量 ==========

/**
 * 全局通用状态枚举
 */
export const CommonStatusEnum = {
  ENABLE: 0, // 开启
  DISABLE: 1, // 禁用
};

/**
 * 菜单的类型枚举
 */
export const SystemMenuTypeEnum = {
  DIR: 1, // 目录
  MENU: 2, // 菜单
  BUTTON: 3, // 按钮
};

/**
 * 角色的类型枚举
 */
export const SystemRoleTypeEnum = {
  SYSTEM: 1, // 内置角色
  CUSTOM: 2, // 自定义角色
};

/**
 * 数据权限的范围枚举
 */
export const SystemDataScopeEnum = {
  ALL: 1, // 全部数据权限
  DEPT_CUSTOM: 2, // 指定部门数据权限
  DEPT_ONLY: 3, // 部门数据权限
  DEPT_AND_CHILD: 4, // 部门及以下数据权限
  DEPT_SELF: 5, // 仅本人数据权限
};

/**
 * 代码生成模板类型
 */
export const InfraCodegenTemplateTypeEnum = {
  CRUD: 1, // 基础 CRUD
  TREE: 2, // 树形 CRUD
  SUB: 3, // 主子表 CRUD
};

/**
 * 任务状态的枚举
 */
export const InfraJobStatusEnum = {
  INIT: 0, // 初始化中
  NORMAL: 1, // 运行中
  STOP: 2, // 暂停运行
};

/**
 * API 异常数据的处理状态
 */
export const InfraApiErrorLogProcessStatusEnum = {
  INIT: 0, // 未处理
  DONE: 1, // 已处理
  IGNORE: 2, // 已忽略
};

/**
 * 用户的社交平台的类型枚举
 */
export const SystemUserSocialTypeEnum = {
  DINGTALK: {
    title: "钉钉",
    type: 20,
    source: "dingtalk",
    img: "https://s1.ax1x.com/2022/05/22/OzMDRs.png",
  },
  WECHAT_ENTERPRISE: {
    title: "企业微信",
    type: 30,
    source: "wechat_enterprise",
    img: "https://s1.ax1x.com/2022/05/22/OzMrzn.png",
  },
};

/**
 * 支付渠道枚举
 */
export const PayChannelEnum = {
  WX_PUB: {
    code: "wx_pub",
    name: "微信 JSAPI 支付",
  },
  WX_LITE: {
    code: "wx_lite",
    name: "微信小程序支付",
  },
  WX_APP: {
    code: "wx_app",
    name: "微信 APP 支付",
  },
  WX_NATIVE: {
    code: "wx_native",
    name: "微信扫码支付",
  },
  WX_BAR: {
    code: "wx_bar",
    name: "微信条码支付",
  },
  ALIPAY_PC: {
    code: "alipay_pc",
    name: "支付宝 PC 网站支付",
  },
  ALIPAY_WAP: {
    code: "alipay_wap",
    name: "支付宝 WAP 网站支付",
  },
  ALIPAY_APP: {
    code: "alipay_app",
    name: "支付宝 APP 支付",
  },
  ALIPAY_QR: {
    code: "alipay_qr",
    name: "支付宝扫码支付",
  },
  ALIPAY_BAR: {
    code: "alipay_bar",
    name: "支付宝条码支付",
  },
  MOCK: {
    code: "mock",
    name: "模拟支付",
  },
  WALLET: {
    code: "wallet",
    name: "钱包支付",
  },
};

/**
 * 支付的展示模式每局
 */
export const PayDisplayModeEnum = {
  URL: {
    mode: "url",
  },
  IFRAME: {
    mode: "iframe",
  },
  FORM: {
    mode: "form",
  },
  QR_CODE: {
    mode: "qr_code",
  },
  APP: {
    mode: "app",
  },
};

/**
 * 支付订单状态枚举
 */
export const PayOrderStatusEnum = {
  WAITING: {
    status: 0,
    name: "未支付",
  },
  SUCCESS: {
    status: 10,
    name: "已支付",
  },
  CLOSED: {
    status: 20,
    name: "支付关闭",
  },
};

/**
 * 支付退款订单状态枚举
 */
export const PayRefundStatusEnum = {
  CREATE: {
    status: 0,
    name: "退款订单生成",
  },
  SUCCESS: {
    status: 1,
    name: "退款成功",
  },
  FAILURE: {
    status: 2,
    name: "退款失败",
  },
  PROCESSING_NOTIFY: {
    status: 3,
    name: "退款中，渠道通知结果",
  },
  PROCESSING_QUERY: {
    status: 4,
    name: "退款中，系统查询结果",
  },
  UNKNOWN_RETRY: {
    status: 5,
    name: "状态未知，请重试",
  },
  UNKNOWN_QUERY: {
    status: 6,
    name: "状态未知，系统查询结果",
  },
  CLOSE: {
    status: 99,
    name: "退款关闭",
  },
};

/**
 * 商品 SPU 状态
 */
export const ProductSpuStatusEnum = {
  RECYCLE: {
    status: -1,
    name: "回收站",
  },
  DISABLE: {
    status: 0,
    name: "下架",
  },
  ENABLE: {
    status: 1,
    name: "上架",
  },
};

/**
 * 优惠类型枚举
 */
export const PromotionDiscountTypeEnum = {
  PRICE: {
    type: 1,
    name: "满减",
  },
  PERCENT: {
    type: 2,
    name: "折扣",
  },
};

/**
 * 优惠劵模板的有限期类型的枚举
 */
export const CouponTemplateValidityTypeEnum = {
  DATE: {
    type: 1,
    name: "固定日期可用",
  },
  TERM: {
    type: 2,
    name: "领取之后可用",
  },
};

/**
 * 营销的商品范围枚举
 */
export const PromotionProductScopeEnum = {
  ALL: {
    scope: 1,
    name: "全部商品参与",
  },
  SPU: {
    scope: 2,
    name: "指定商品参与",
  },
};

/**
 * 营销的条件类型枚举
 */
export const PromotionConditionTypeEnum = {
  PRICE: {
    type: 10,
    name: "满 N 元",
  },
  COUNT: {
    type: 20,
    name: "满 N 件",
  },
};

/**
 * 促销活动的状态枚举
 */
export const PromotionActivityStatusEnum = {
  WAIT: {
    type: 10,
    name: "未开始",
  },
  RUN: {
    type: 20,
    name: "进行中",
  },
  END: {
    type: 30,
    name: "已结束",
  },
  CLOSE: {
    type: 40,
    name: "已关闭",
  },
};

/**
 * 配送方式枚举
 */
export const DeliveryTypeEnum = {
  EXPRESS: {
    type: 1,
    name: "快递发货",
  },
  PICK_UP: {
    type: 2,
    name: "到店自提",
  },
};
/**
 * 交易订单 - 状态
 */
export const TradeOrderStatusEnum = {
  UNPAID: {
    status: 0,
    name: "待支付",
  },
  UNDELIVERED: {
    status: 10,
    name: "待发货",
  },
  DELIVERED: {
    status: 20,
    name: "已发货",
  },
  COMPLETED: {
    status: 30,
    name: "已完成",
  },
  CANCELED: {
    status: 40,
    name: "已取消",
  },
};

// ========== MALL - 交易模块 ==========
/**
 * 分销关系绑定模式枚举
 */
export const BrokerageBindModeEnum = {
  ANYTIME: {
    mode: 1,
    name: "首次绑定",
  },
  REGISTER: {
    mode: 2,
    name: "注册绑定",
  },
  OVERRIDE: {
    mode: 3,
    name: "覆盖绑定",
  },
};
/**
 * 分佣模式枚举
 */
export const BrokerageEnabledConditionEnum = {
  ALL: {
    condition: 1,
    name: "人人分销",
  },
  ADMIN: {
    condition: 2,
    name: "指定分销",
  },
};
/**
 * 佣金记录业务类型枚举
 */
export const BrokerageRecordBizTypeEnum = {
  ORDER: {
    type: 1,
    name: "获得推广佣金",
  },
  WITHDRAW: {
    type: 2,
    name: "提现申请",
  },
};
/**
 * 佣金提现状态枚举
 */
export const BrokerageWithdrawStatusEnum = {
  AUDITING: {
    status: 0,
    name: "审核中",
  },
  AUDIT_SUCCESS: {
    status: 10,
    name: "审核通过",
  },
  AUDIT_FAIL: {
    status: 20,
    name: "审核不通过",
  },
  WITHDRAW_SUCCESS: {
    status: 11,
    name: "提现成功",
  },
  WITHDRAW_FAIL: {
    status: 21,
    name: "提现失败",
  },
};
/**
 * 佣金提现类型枚举
 */
export const BrokerageWithdrawTypeEnum = {
  WALLET: {
    type: 1,
    name: "钱包",
  },
  BANK: {
    type: 2,
    name: "银行卡",
  },
  WECHAT: {
    type: 3,
    name: "微信",
  },
  ALIPAY: {
    type: 4,
    name: "支付宝",
  },
};
