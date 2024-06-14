<script>
import { isNumber } from "@/utils/is";

export default {
  name: "Dialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Dialog",
    },
    fullscreen: {
      type: Boolean,
      default: true,
    },
    width: {
      type: [String, Number],
      default: "40%",
    },
    // 是否开启滚动条。如果是的话，按照 maxHeight 设置最大高度
    scroll: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: [String, Number],
      default: "400px",
    },
  },
  data() {
    return {
      isFullscreen: false,
      dialogHeight: isNumber(this.maxHeight)
        ? `${this.maxHeight}px`
        : this.maxHeight,
    };
  },
  computed: {
    dialogStyle() {
      return {
        height: this.dialogHeight,
      };
    },
    getBindValue() {
      const delArr = ["fullscreen", "title", "maxHeight"];
      const attrs = this.$attrs;
      const { visible, width } = this;
      const obj = { ...attrs, visible, width };
      for (const key in obj) {
        if (delArr.indexOf(key) !== -1) {
          delete obj[key];
        }
      }
      return obj;
    },
  },
  methods: {
    toggleFull() {
      this.isFullscreen = !this.isFullscreen;
    },
    close() {
      this.$emit("update:visible", false);
    },
  },
  watch: {
    isFullscreen: {
      async handler(val) {
        await this.$nextTick();
        if (val) {
          const windowHeight = document.documentElement.offsetHeight;
          this.dialogHeight = `${windowHeight - 54 - 30 - (this.$slots.footer ? 54 : 0)}px`;
        } else {
          this.dialogHeight = isNumber(this.maxHeight)
            ? `${this.maxHeight}px`
            : this.maxHeight;
        }
      },
      immediate: true,
    },
  },
};
</script>

<template>
  <ElDialog
    v-bind="getBindValue"
    v-on="$listeners"
    :fullscreen="isFullscreen"
    class="atguigu-dialog"
    :show-close="false"
    :close-on-click-modal="true"
    destroy-on-close
  >
    <template #title>
      <div class="dialog-header">
        <span>{{ title }}</span>
        <div class="dialog-header-right">
          <svg-icon
            class="dialog-icon"
            v-if="fullscreen"
            iconClass="fullscreen"
            @click="toggleFull"
          />
          <svg-icon
            class="dialog-icon"
            v-else
            iconClass="exit-fullscreen"
            @click="toggleFull"
          />
          <i class="dialog-icon el-icon-close" @click="close" />
        </div>
      </div>
    </template>

    <div :style="scroll ? dialogStyle : {}">
      <slot></slot>
    </div>

    <template v-if="$slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>

<style lang="scss">
.atguigu-dialog {
  font-size: 16px;
  .el-dialog {
    max-width: none;
    max-height: none;
  }

  .el-dialog__header {
    height: 54px;
    padding: 0;
    border-bottom: 1px solid #dcdfe6;
  }

  .el-dialog__body {
    padding: 15px;
  }

  .el-dialog__footer {
    border-top: 1px solid #dcdfe6;
    height: 54px;
  }

  .dialog-icon {
    width: 12px;
    height: 12px;
    color: #909399;
    cursor: pointer;
  }
  .el-icon-close {
    width: 18px;
    height: 18px;
    font-size: 18px;
    margin-left: 10px;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    align-items: center;
    height: 100%;
  }

  .dialog-header-right {
    display: flex;
    align-items: center;
  }
}
</style>
