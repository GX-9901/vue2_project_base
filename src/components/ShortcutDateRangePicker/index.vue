<template>
  <div class="shortcut">
    <el-radio-group v-model="shortcutDays" @change="handleShortcutDaysChange">
      <el-radio-button :label="1">昨天</el-radio-button>
      <el-radio-button :label="7">最近7天</el-radio-button>
      <el-radio-button :label="30">最近30天</el-radio-button>
    </el-radio-group>
    <el-date-picker
      v-model="times"
      value-format="YYYY-MM-DD HH:mm:ss"
      type="daterange"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]"
      :shortcuts="shortcuts"
      class="picker"
      @change="emitDateRangePicker"
    />
    <slot></slot>
  </div>
</template>
<script>
import dayjs from "dayjs";
import * as DateUtil from "@/utils/formatTime";

/** 快捷日期范围选择组件 */
export default {
  name: "ShortcutDateRangePicker",
  data() {
    return {
      shortcutDays: 7, // 日期快捷天数（单选按钮组）, 默认7天
      times: ["", ""], // 时间范围参数
      /** 日期快捷选择 */
      shortcuts: [
        {
          text: "昨天",
          value: () => DateUtil.getDayRange(new Date(), -1),
        },
        {
          text: "最近7天",
          value: () => DateUtil.getLast7Days(),
        },
        {
          text: "本月",
          value: () => [dayjs().startOf("M"), dayjs().subtract(1, "d")],
        },
        {
          text: "最近30天",
          value: () => DateUtil.getLast30Days(),
        },
        {
          text: "最近1年",
          value: () => DateUtil.getLast1Year(),
        },
      ],
    };
  },
  methods: {
    /** 设置时间范围 */
    setTimes() {
      const beginDate = dayjs().subtract(this.shortcutDays, "d");
      const yesterday = dayjs().subtract(1, "d");
      this.times = DateUtil.getDateRange(beginDate, yesterday);
    },
    /** 快捷日期单选按钮选中 */
    async handleShortcutDaysChange() {
      // 设置时间范围
      this.setTimes();
      // 发送时间范围选中事件
      await this.emitDateRangePicker();
    },
    /** 触发时间范围选中事件 */
    emitDateRangePicker() {
      this.$emit("change", this.times);
    },
  },
  mounted() {
    this.handleShortcutDaysChange();
  },
};
</script>

<style lang="scss" scoped>
.shortcut {
  display: flex;
  align-items: center;
}

.picker {
  margin-left: 10px;
}
</style>
