<template>
  <Dialog :title="dialogTitle" :visible.sync="dialogVisible" width="60%">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      v-loading="formLoading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店 logo" prop="logo">
            <UploadImg
              v-model="formData.logo"
              :limit="1"
              :is-show-tip="false"
            />
            <div style="font-size: 10px" class="pl-10px">
              推荐 180x180 图片分辨率
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio
                v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
                :key="dict.value"
                :label="dict.value"
              >
                {{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入门店名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店手机" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入门店手机" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="门店简介" prop="introduction">
        <el-input
          v-model="formData.introduction"
          :rows="3"
          type="textarea"
          placeholder="请输入门店简介"
        />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="门店所在地区" prop="areaId">
            <el-cascader
              v-model="formData.areaId"
              :options="areaList"
              :props="defaultProps"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门店详细地址" prop="detailAddress">
            <el-input
              v-model="formData.detailAddress"
              placeholder="请输入门店详细地址"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="营业开始时间" prop="openingTime">
            <el-time-select
              v-model="formData.openingTime"
              :max-time="formData.closingTime"
              placeholder="开始时间"
              start="08:30"
              step="00:15"
              end="23:30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业结束时间" prop="closingTime">
            <el-time-select
              v-model="formData.closingTime"
              :min-time="formData.openingTime"
              placeholder="结束时间"
              start="08:30"
              step="00:15"
              end="23:30"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="经度" prop="longitude">
            <el-input
              v-model="formData.longitude"
              placeholder="请输入门店经度"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度" prop="latitude">
            <el-input
              v-model="formData.latitude"
              placeholder="请输入门店纬度"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="获取经纬度">
        <el-button type="primary" @click="mapDialogVisible = true"
          >获取</el-button
        >
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading"
        >确 定</el-button
      >
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
    <el-dialog
      :visible.sync="mapDialogVisible"
      title="获取经纬度"
      append-to-body
      width="500px"
      class="mapBox"
    >
      <iframe
        id="mapPage"
        width="100%"
        height="100%"
        frameborder="0"
        :src="tencentLbsUrl"
      ></iframe>
    </el-dialog>
  </Dialog>
</template>
<script>
import * as DeliveryPickUpStoreApi from "@/api/mall/trade/delivery/pickUpStore";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { CommonStatusEnum } from "@/utils/constants";
import { defaultProps } from "@/utils/tree";
import { getAreaTree } from "@/api/system/area";
import * as ConfigApi from "@/api/mall/trade/config";

export default {
  name: "PickUpStoreForm",
  data() {
    return {
      dialogVisible: false, // 弹窗的是否展示
      mapDialogVisible: false, // 地图弹窗的是否展示
      dialogTitle: "", // 弹窗的标题
      formLoading: false, // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formType: "", // 表单的类型：create - 新增；update - 修改
      formData: {
        id: undefined,
        name: "",
        phone: "",
        logo: "",
        detailAddress: "",
        introduction: "",
        areaId: 0,
        openingTime: undefined,
        closingTime: undefined,
        latitude: undefined,
        longitude: undefined,
        status: CommonStatusEnum.ENABLE,
      },
      formRules: {
        name: [
          { required: true, message: "门店名称不能为空", trigger: "blur" },
        ],
        logo: [
          { required: true, message: "门店 logo 不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "门店手机不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        areaId: [
          { required: true, message: "门店所在区域不能为空", trigger: "blur" },
        ],
        detailAddress: [
          { required: true, message: "门店详细地址不能为空", trigger: "blur" },
        ],
        openingTime: [
          { required: true, message: "营业开始时间不能为空", trigger: "blur" },
        ],
        closingTime: [
          { required: true, message: "营业结束时间不能为空", trigger: "blur" },
        ],
        latitude: [
          { required: true, message: "纬度不能为空", trigger: "blur" },
        ],
        longitude: [
          { required: true, message: "经度不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "开启状态不能为空", trigger: "blur" },
        ],
      },
      areaList: [], // 区域树
      tencentLbsUrl: "", // 腾讯位置服务 url
      defaultProps,
    };
  },
  methods: {
    getIntDictOptions,
    /** 打开弹窗 */
    async open(type, id) {
      this.dialogVisible = true;
      this.dialogTitle = type === "create" ? "新增" : "修改";
      this.formType = type;
      this.resetForm();
      // 修改时，设置数据
      if (id) {
        this.formLoading = true;
        try {
          const { data } =
            await DeliveryPickUpStoreApi.getDeliveryPickUpStore(id);
          this.formData = data;
        } finally {
          this.formLoading = false;
        }
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
        const { data } = this.formData;
        if (this.formType === "create") {
          await DeliveryPickUpStoreApi.createDeliveryPickUpStore(data);
          this.$message.success("添加成功");
        } else {
          await DeliveryPickUpStoreApi.updateDeliveryPickUpStore(data);
          this.$message.success("修改成功");
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
        phone: "",
        logo: "",
        detailAddress: "",
        introduction: "",
        areaId: undefined,
        openingTime: undefined,
        closingTime: undefined,
        latitude: undefined,
        longitude: undefined,
        status: CommonStatusEnum.ENABLE,
      };
      this.$refs.formRef?.resetFields();
    },
    /** 选择经纬度 */
    selectAddress(loc) {
      if (loc.latlng && loc.latlng.lat) {
        this.formData.latitude = loc.latlng.lat;
      }
      if (loc.latlng && loc.latlng.lng) {
        this.formData.longitude = loc.latlng.lng;
      }
      this.mapDialogVisible = false;
    },
    /** 初始化腾讯地图 */
    async initTencentLbsMap() {
      window.selectAddress = this.selectAddress;
      window.addEventListener(
        "message",
        function (event) {
          // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
          let loc = event.data;
          if (loc && loc.module === "locationPicker") {
            // 防止其他应用也会向该页面 post 信息，需判断 module 是否为 'locationPicker'
            window.parent.selectAddress(loc);
          }
        },
        false,
      );
      const { data } = await ConfigApi.getTradeConfig();
      const key = data.tencentLbsKey;
      this.tencentLbsUrl = `https://apis.map.qq.com/tools/locpicker?type=1&key=${key}&referer=myapp`;
    },
  },
  async mounted() {
    const { data } = await getAreaTree();
    this.areaList = data;
    // 加载地图
    await this.initTencentLbsMap();
  },
};
</script>
<style lang="scss">
.mapBox .el-dialog__body {
  height: 640px !important;
}
</style>
