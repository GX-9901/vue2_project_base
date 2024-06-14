<template>
  <Dialog :title="dialogTitle" :visible.sync="dialogVisible" width="1300px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
      v-loading="formLoading"
    >
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入模板名称" />
      </el-form-item>
      <el-form-item label="计费方式" prop="chargeMode">
        <el-radio-group
          v-model="formData.chargeMode"
          @change="changeChargeMode"
        >
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.EXPRESS_CHARGE_MODE)"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="运费" prop="charges">
        <el-table border style="width: 100%" :data="formData.charges">
          <el-table-column align="center" label="区域" width="360">
            <template #default="{ row }">
              <el-cascader
                v-model="row.areaIds"
                :options="areaTree"
                :props="defaultProps2"
                class="w-1/1"
                clearable
                placeholder="请选择地区"
                filterable
                collapse-tags
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="columnTitle.startCountTitle"
            width="180"
            prop="startCount"
          >
            <template #default="{ row }">
              <el-input-number v-model="row.startCount" :min="1" />
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            align="center"
            label="运费(元)"
            prop="startPrice"
          >
            <template #default="{ row }">
              <el-input-number v-model="row.startPrice" :min="1" />
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            align="center"
            :label="columnTitle.extraCountTitle"
            prop="extraCount"
          >
            <template #default="{ row }">
              <el-input-number v-model="row.extraCount" :min="1" />
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            align="center"
            label="续费(元)"
            prop="extraPrice"
          >
            <template #default="{ row }">
              <el-input-number v-model="row.extraPrice" :min="1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button
                link
                type="danger"
                @click="deleteChargeArea(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="addChargeArea()">
          <Icon icon="ep:plus" class="mr-5px" /> 添加区域
        </el-button>
      </el-form-item>
      <el-form-item label="包邮区域" prop="frees">
        <el-table border style="width: 100%" :data="formData.frees">
          <el-table-column align="center" label="区域" width="360">
            <template #default="{ row }">
              <el-cascader
                v-model="row.areaIds"
                :options="areaTree"
                :props="defaultProps2"
                class="w-1/1"
                clearable
                placeholder="请选择商品分类"
                filterable
                collapse-tags
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="columnTitle.freeCountTitle"
            prop="freeCount"
          >
            <template #default="{ row }">
              <el-input-number v-model="row.freeCount" :min="1" />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="包邮金额（元）"
            prop="freePrice"
          >
            <template #default="{ row }">
              <el-input-number v-model="row.freePrice" :min="1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button
                link
                type="danger"
                @click="deleteFreeArea(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click="addFreeArea()"
          icon="el-icon-plus"
        >
          添加区域
        </el-button>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="formData.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading"
        >确 定</el-button
      >
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script>
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import * as DeliveryExpressTemplateApi from "@/api/mall/trade/delivery/expressTemplate";
import * as AreaApi from "@/api/system/area";
import { defaultProps } from "@/utils/tree";
import { yuanToFen, fenToYuan } from "@/utils";
import { cloneDeep } from "lodash-es";

export default {
  name: "ExpressTemplate",
  data() {
    return {
      getIntDictOptions,
      defaultProps2: {
        ...defaultProps,
        multiple: true,
      },
      dialogVisible: false, // 弹窗的是否展示
      dialogTitle: "", // 弹窗的标题
      formLoading: false, // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formType: "", // 表单的类型：create - 新增；update - 修改
      formData: {
        id: undefined,
        name: "",
        chargeMode: 1,
        sort: 0,
        charges: [],
        frees: [],
      },
      columnTitleMap: new Map(),
      columnTitle: {
        startCountTitle: "首件",
        extraCountTitle: "续件",
        freeCountTitle: "包邮件数",
      },
      formRules: {
        name: [
          { required: true, message: "模板名称不能为空", trigger: "blur" },
        ],
        chargeMode: [
          { required: true, message: "配送计费方式不能为空", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "分类排序不能为空", trigger: "blur" },
        ],
      },
      areaTree: [],
    };
  },
  methods: {
    /** 打开弹窗 */
    async open(type, id) {
      this.dialogVisible = true;
      this.dialogTitle = type === "create" ? "新增" : "修改";
      this.formType = type;
      this.resetForm();
      try {
        // 修改时，设置数据
        if (id) {
          this.formLoading = true;
          const { data } =
            await DeliveryExpressTemplateApi.getDeliveryExpressTemplate(id);
          this.formData = data;
          this.columnTitle = this.columnTitleMap.get(data.chargeMode);
          this.formData.charges.forEach((item) => {
            // 前端价格以元展示
            item.startPrice = fenToYuan(item.startPrice);
            item.extraPrice = fenToYuan(item.extraPrice);
          });
          this.formData.frees.forEach((item) => {
            item.freePrice = fenToYuan(item.freePrice);
          });
        }
      } finally {
        this.formLoading = false;
      }
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
        const data = cloneDeep(this.formData);
        // 前端价格以元展示，提交到后端。用分计算
        data.charges.forEach((item) => {
          item.startPrice = yuanToFen(item.startPrice);
          item.extraPrice = yuanToFen(item.extraPrice);
        });
        data.frees.forEach((item) => {
          item.freePrice = yuanToFen(item.freePrice);
        });
        if (this.formType === "create") {
          await DeliveryExpressTemplateApi.createDeliveryExpressTemplate(data);
          this.$message.success("添加成功");
        } else {
          await DeliveryExpressTemplateApi.updateDeliveryExpressTemplate(data);
          this.$message.success("更新成功");
        }
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
        name: "",
        chargeMode: 1,
        charges: [
          {
            areaIds: [1],
            startCount: 2,
            startPrice: 5,
            extraCount: 5,
            extraPrice: 10,
          },
        ],
        frees: [],
        sort: 0,
      };
      this.columnTitle = this.columnTitleMap.get(1);
      this.$refs.formRef?.resetFields();
    },
    /** 配送计费方法改变 */
    changeChargeMode(chargeMode) {
      this.columnTitle = this.columnTitleMap.get(chargeMode);
    },
    async initData() {
      // 表头标题和计费方式的映射
      this.columnTitleMap.set(1, {
        startCountTitle: "首件",
        extraCountTitle: "续件",
        freeCountTitle: "包邮件数",
      });
      this.columnTitleMap.set(2, {
        startCountTitle: "首件重量(kg)",
        extraCountTitle: "续件重量(kg)",
        freeCountTitle: "包邮重量(kg)",
      });
      this.columnTitleMap.set(3, {
        startCountTitle: "首件体积(m³)",
        extraCountTitle: "续件体积(m³)",
        freeCountTitle: "包邮体积(m³)",
      });
      // 加载区域数据
      const { data } = await AreaApi.getAreaTree();
      this.areaTree = data;
    },
    /** 添加计费区域 */
    addChargeArea() {
      const data = this.formData;
      data.charges.push({
        areaIds: [],
        startCount: 1,
        startPrice: 1,
        extraCount: 1,
        extraPrice: 1,
      });
    },
    /** 删除计费区域 */
    deleteChargeArea(index) {
      const data = this.formData;
      data.charges.splice(index, 1);
    },
    /** 添加包邮区域 */
    addFreeArea() {
      const data = this.formData;
      data.frees.push({
        areaIds: [],
        freeCount: 1,
        freePrice: 1,
      });
    },
    /** 删除包邮区域 */
    deleteFreeArea(index) {
      const data = this.formData;
      data.frees.splice(index, 1);
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
