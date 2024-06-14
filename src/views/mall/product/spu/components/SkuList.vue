<template>
  <div>
    <!-- 情况一：添加/修改 -->
    <el-table
      v-if="!isDetail && !isActivityComponent"
      :data="isBatch ? skuList : formData.skus"
      border
      class="tabNumWidth"
      max-height="500"
      size="small"
    >
      <el-table-column align="center" label="图片" min-width="65">
        <template #default="{ row }">
          <ImageUpload v-model="row.picUrl" height="50px" width="50px" />
        </template>
      </el-table-column>
      <template v-if="formData.specType && !isBatch">
        <!--  根据商品属性动态添加 -->
        <el-table-column
          v-for="(item, index) in tableHeaders"
          :key="index"
          :label="item.label"
          align="center"
          min-width="120"
        >
          <template #default="{ row }">
            <span style="font-weight: bold; color: #40aaff">
              {{ row.properties[index]?.valueName }}
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" label="商品条码" min-width="168">
        <template #default="{ row }">
          <el-input v-model="row.barCode" class="w-100%" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售价" min-width="168">
        <template #default="{ row }">
          <el-input-number
            v-model="row.price"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-100%"
            controls-position="right"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="市场价" min-width="168">
        <template #default="{ row }">
          <el-input-number
            v-model="row.marketPrice"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-100%"
            controls-position="right"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="成本价" min-width="168">
        <template #default="{ row }">
          <el-input-number
            v-model="row.costPrice"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-100%"
            controls-position="right"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存" min-width="168">
        <template #default="{ row }">
          <el-input-number
            v-model="row.stock"
            :min="0"
            class="w-100%"
            controls-position="right"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="重量(kg)" min-width="168">
        <template #default="{ row }">
          <el-input-number
            v-model="row.weight"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-100%"
            controls-position="right"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="体积(m^3)" min-width="168">
        <template #default="{ row }">
          <el-input-number
            v-model="row.volume"
            :min="0"
            :precision="2"
            :step="0.1"
            class="w-100%"
            controls-position="right"
          />
        </template>
      </el-table-column>
      <template v-if="formData.subCommissionType">
        <el-table-column align="center" label="一级返佣(元)" min-width="168">
          <template #default="{ row }">
            <el-input-number
              v-model="row.firstBrokeragePrice"
              :min="0"
              :precision="2"
              :step="0.1"
              class="w-100%"
              controls-position="right"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="二级返佣(元)" min-width="168">
          <template #default="{ row }">
            <el-input-number
              v-model="row.secondBrokeragePrice"
              :min="0"
              :precision="2"
              :step="0.1"
              class="w-100%"
              controls-position="right"
            />
          </template>
        </el-table-column>
      </template>
      <el-table-column
        v-if="formData?.specType"
        align="center"
        fixed="right"
        label="操作"
        width="80"
      >
        <template #default="{ row }">
          <el-button
            v-if="isBatch"
            link
            size="small"
            type="primary"
            @click="batchAdd"
          >
            批量添加
          </el-button>
          <el-button
            v-else
            link
            size="small"
            type="primary"
            @click="deleteSku(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 情况二：详情 -->
    <el-table
      v-if="isDetail"
      ref="activitySkuListRef"
      :data="formData.skus"
      border
      max-height="500"
      size="small"
      style="width: 99%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="isComponent" type="selection" width="45" />
      <el-table-column align="center" label="图片" min-width="80">
        <template #default="{ row }">
          <el-image
            v-if="row.picUrl"
            :src="row.picUrl"
            class="h-50px w-50px"
            @click="imagePreview(row.picUrl)"
          />
        </template>
      </el-table-column>
      <template v-if="formData.specType && !isBatch">
        <!--  根据商品属性动态添加 -->
        <el-table-column
          v-for="(item, index) in tableHeaders"
          :key="index"
          :label="item.label"
          align="center"
          min-width="80"
        >
          <template #default="{ row }">
            <span style="font-weight: bold; color: #40aaff">
              {{ row.properties[index]?.valueName }}
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" label="商品条码" min-width="100">
        <template #default="{ row }">
          {{ row.barCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售价(元)" min-width="80">
        <template #default="{ row }">
          {{ row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="市场价(元)" min-width="80">
        <template #default="{ row }">
          {{ row.marketPrice }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="成本价(元)" min-width="80">
        <template #default="{ row }">
          {{ row.costPrice }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存" min-width="80">
        <template #default="{ row }">
          {{ row.stock }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="重量(kg)" min-width="80">
        <template #default="{ row }">
          {{ row.weight }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="体积(m^3)" min-width="80">
        <template #default="{ row }">
          {{ row.volume }}
        </template>
      </el-table-column>
      <template v-if="formData.subCommissionType">
        <el-table-column align="center" label="一级返佣(元)" min-width="80">
          <template #default="{ row }">
            {{ row.firstBrokeragePrice }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="二级返佣(元)" min-width="80">
          <template #default="{ row }">
            {{ row.secondBrokeragePrice }}
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 情况三：作为活动组件 -->
    <el-table
      v-if="isActivityComponent"
      :data="formData.skus"
      border
      max-height="500"
      size="small"
      style="width: 99%"
    >
      <el-table-column v-if="isComponent" type="selection" width="45" />
      <el-table-column align="center" label="图片" min-width="80">
        <template #default="{ row }">
          <el-image
            :src="row.picUrl"
            class="h-60px w-60px"
            @click="imagePreview(row.picUrl)"
          />
        </template>
      </el-table-column>
      <template v-if="formData.specType">
        <!--  根据商品属性动态添加 -->
        <el-table-column
          v-for="(item, index) in tableHeaders"
          :key="index"
          :label="item.label"
          align="center"
          min-width="80"
        >
          <template #default="{ row }">
            <span style="font-weight: bold; color: #40aaff">
              {{ row.properties[index]?.valueName }}
            </span>
          </template>
        </el-table-column>
      </template>
      <el-table-column align="center" label="商品条码" min-width="100">
        <template #default="{ row }">
          {{ row.barCode }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="销售价(元)" min-width="80">
        <template #default="{ row }">
          {{ row.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="市场价(元)" min-width="80">
        <template #default="{ row }">
          {{ row.marketPrice }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="成本价(元)" min-width="80">
        <template #default="{ row }">
          {{ row.costPrice }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存" min-width="80">
        <template #default="{ row }">
          {{ row.stock }}
        </template>
      </el-table-column>
      <!--  方便扩展每个活动配置的属性不一样  -->
      <slot name="extension"></slot>
    </el-table>
  </div>
</template>
<script>
// import { copyValueToTarget } from "@/utils";
import ImageUpload from "@/components/ImageUpload";
// import { createImageViewer } from "@/components/ImageViewer";

export default {
  name: "SkuList",
  components: {
    ImageUpload,
  },
  props: {
    propFormData: {
      type: Object,
      default: () => ({}),
    },
    propertyList: {
      type: Array,
      default: () => [],
    },
    ruleConfig: {
      type: Array,
      default: () => [],
    },
    // 是否作为批量操作组件
    isBatch: {
      type: Boolean,
      default: false,
    },
    // 是否作为 sku 详情组件
    isDetail: {
      type: Boolean,
      default: false,
    },
    // 是否作为 sku 选择组件
    isComponent: {
      type: Boolean,
      default: false,
    },
    // 是否作为 sku 活动配置组件
    isActivityComponent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {}, // 表单数据
      skuList: [
        // 批量添加时的临时数据
        {
          price: 0, // 商品价格
          marketPrice: 0, // 市场价
          costPrice: 0, // 成本价
          barCode: "", // 商品条码
          picUrl: "", // 图片地址
          stock: 0, // 库存
          weight: 0, // 商品重量
          volume: 0, // 商品体积
          firstBrokeragePrice: 0, // 一级分销的佣金
          secondBrokeragePrice: 0, // 二级分销的佣金
        },
      ],
      tableHeaders: [], // 多属性表头
    };
  },
  methods: {
    /** 商品图预览 */
    imagePreview(imgUrl) {
      // createImageViewer({
      //   zIndex: 9999999,
      //   urlList: [imgUrl],
      // });
    },
    /** 批量添加 */
    batchAdd() {
      this.formData.skus.forEach((item) => {
        this.copyValueToTarget(item, this.skuList.value[0]);
      });
    },
    /** 删除 sku */
    deleteSku(row) {
      const index = this.formData.skus.findIndex(
        // 直接把列表转成字符串比较
        (sku) =>
          JSON.stringify(sku.properties) === JSON.stringify(row.properties),
      );
      this.formData.skus.splice(index, 1);
    },
    /**
     * 保存时，每个商品规格的表单要校验下。例如说，销售金额最低是 0.01 这种。
     */
    validateSku() {
      let warningInfo = "请检查商品各行相关属性配置，";
      let validate = true; // 默认通过
      for (const sku of this.formData.skus) {
        // 作为活动组件的校验
        for (const rule of this.ruleConfig) {
          const arg = this.getValue(sku, rule.name);
          if (!rule.rule(arg)) {
            validate = false; // 只要有一个不通过则直接不通过
            warningInfo += rule.message;
            break;
          }
        }
        // 只要有一个不通过则结束后续的校验
        if (!validate) {
          this.$message.warning(warningInfo);
          throw new Error(warningInfo);
        }
      }
    },
    getValue(obj, arg) {
      const keys = arg.split(".");
      let value = obj;
      for (const key of keys) {
        if (value && typeof value === "object" && key in value) {
          value = value[key];
        } else {
          value = undefined;
          break;
        }
      }
      return value;
    },
    /**
     * 选择时触发
     * @param Sku 传递过来的选中的 sku 是一个数组
     */
    handleSelectionChange(val) {
      this.$emit("selectionChange", val);
    },
    /** 生成表数据 */
    generateTableData(propertyList) {
      // 构建数据结构
      const propertyValues = propertyList.map((item) =>
        item.values.map((v) => ({
          propertyId: item.id,
          propertyName: item.name,
          valueId: v.id,
          valueName: v.name,
        })),
      );
      const buildSkuList = this.build(propertyValues);
      // 如果回显的 sku 属性和添加的属性不一致则重置 skus 列表
      if (!this.validateData(propertyList)) {
        // 如果不一致则重置表数据，默认添加新的属性重新生成 sku 列表
        this.formData.skus = [];
      }
      for (const item of buildSkuList) {
        const row = {
          properties: Array.isArray(item) ? item : [item], // 如果只有一个属性的话返回的是一个 property 对象
          price: 0,
          marketPrice: 0,
          costPrice: 0,
          barCode: "",
          picUrl: "",
          stock: 0,
          weight: 0,
          volume: 0,
          firstBrokeragePrice: 0,
          secondBrokeragePrice: 0,
        };
        // 如果存在属性相同的 sku 则不做处理
        const index = this.formData.skus.findIndex(
          (sku) =>
            JSON.stringify(sku.properties) === JSON.stringify(row.properties),
        );
        if (index !== -1) {
          continue;
        }
        this.formData.skus.push(row);
      }
    },
    /**
     * 生成 skus 前置校验
     */
    validateData(propertyList) {
      const skuPropertyIds = [];
      this.formData.skus.forEach((sku) =>
        sku.properties
          ?.map((property) => property.propertyId)
          ?.forEach((propertyId) => {
            if (skuPropertyIds.indexOf(propertyId) === -1) {
              skuPropertyIds.push(propertyId);
            }
          }),
      );
      const propertyIds = propertyList.map((item) => item.id);
      return skuPropertyIds.length === propertyIds.length;
    },
    /** 构建所有排列组合 */
    build(propertyValuesList) {
      if (propertyValuesList.length === 0) {
        return [];
      } else if (propertyValuesList.length === 1) {
        return propertyValuesList[0];
      } else {
        const result = [];
        const rest = this.build(propertyValuesList.slice(1));
        for (let i = 0; i < propertyValuesList[0].length; i++) {
          for (let j = 0; j < rest.length; j++) {
            // 第一次不是数组结构，后面的都是数组结构
            if (Array.isArray(rest[j])) {
              result.push([propertyValuesList[0][i], ...rest[j]]);
            } else {
              result.push([propertyValuesList[0][i], rest[j]]);
            }
          }
        }
        return result;
      }
    },
    getSkuTableRef() {
      return this.$refs.activitySkuListRef;
    },
  },
  watch: {
    /**
     * 将传进来的值赋值给 skuList
     */
    propFormData: {
      handler(data) {
        if (!data) return;
        this.formData = data;
      },
      deep: true,
      immediate: true,
    },
    propertyList: {
      handler(propertyList) {
        // 如果不是多规格则结束
        if (!this.formData.specType) {
          return;
        }
        // 如果当前组件作为批量添加数据使用，则重置表数据
        if (this.isBatch) {
          this.skuList = [
            {
              price: 0,
              marketPrice: 0,
              costPrice: 0,
              barCode: "",
              picUrl: "",
              stock: 0,
              weight: 0,
              volume: 0,
              firstBrokeragePrice: 0,
              secondBrokeragePrice: 0,
            },
          ];
        }

        // 判断代理对象是否为空
        if (JSON.stringify(propertyList) === "[]") {
          return;
        }
        // 重置表头
        this.tableHeaders = [];
        // 生成表头
        propertyList.forEach((item, index) => {
          // name加属性项index区分属性值
          this.tableHeaders.push({ prop: `name${index}`, label: item.name });
        });
        // 如果回显的 sku 属性和添加的属性一致则不处理
        if (this.validateData(propertyList)) {
          return;
        }
        // 添加新属性没有属性值也不做处理
        if (propertyList.some((item) => item.values.length === 0)) {
          return;
        }
        // 生成 table 数据，即 sku 列表
        this.generateTableData(propertyList);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
