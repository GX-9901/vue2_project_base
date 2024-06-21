<template>
  <div class="app-container">
    <el-card shadow="never" class="mb-20">
      <el-form inline v-show="isShowSearchForm">
        <el-form-item label="回复状态">
          <el-select placeholder="请选择回复状态" size="small" v-model="searchParams.replyStatus">
            <el-option v-for="opt in replyStatusOptions"
                       :key="opt.value"
                       :label="opt.label"
                       :value="opt.value === 'true' ? true : false"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input placeholder="请输入商品名称" size="small" v-model="searchParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input placeholder="请输入用户名称" size="small" v-model="searchParams.userNickname"></el-input>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input placeholder="请输入订单编号" size="small" v-model="searchParams.orderId"></el-input>
        </el-form-item>
        <el-form-item label="评分">
          <el-select placeholder="请选择评分" size="small" v-model="searchParams.scores">
            <el-option v-for="scores in scoreOptions"
                        :key="scores.value"
                        :label="scores.label"
                        :value="scores.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评论时间">
          <el-date-picker
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="searchParams.createTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">
            搜索
          </el-button>
          <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="flex-between">

        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="showVirtualCommentForm">
          添加虚拟评论
        </el-button>
        <GGRightToolbar :visible.sync="isShowSearchForm" @refresh="getList"/>
      </div>
    </el-card>

    <el-card shadow="never">
      <el-table :data="list" v-loading="loading" rowKey="id" class="mb-20">
        <el-table-column
          label="评论编号"
          prop="id"
          align="center"
        ></el-table-column>
        <el-table-column label="商品信息" align="center" width="450px">
          <template v-slot="{ row }">
            <div class="flex-align-center">
              <el-image :src="row.skuPicUrl" class="sku-img" lazy></el-image>
              <p class="spu-name">{{ row.spuName }}</p>
              <el-tag
                v-for="prop in row.skuProperties"
                :key="prop.propertyId"
                size="mini"
                class="comment-tag"
              >
                {{ prop.propertyName }}: {{ prop.valueName }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="用户名称"
          prop="userNickname"
          align="center"
        ></el-table-column>
        <el-table-column
          label="商品评分"
          prop="scores"
          align="center"
        ></el-table-column>
        <el-table-column
          label="服务评分"
          prop="benefitScores"
          align="center"
        ></el-table-column>
        <el-table-column
          label="评论内容"
          prop="content"
          align="center"
        ></el-table-column>
        <el-table-column
          label="回复内容"
          prop="replyContent"
          align="center"
        ></el-table-column>
        <el-table-column
          label="评论时间"
          :formatter="handleFormatDate"
          align="center"
          width="200px"
        ></el-table-column>
        <el-table-column label="是否展示" prop="visible" align="center">
          <el-switch></el-switch>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template v-slot="{ row }">
            <el-button type="text" @click="showReplyForm(row.id)">回复</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParams.pageNo"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="searchParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        class="flex-end"
      >
      </el-pagination>
    </el-card>
    <ReplyForm ref="replyFormRef" @success="getList" />
    <VirtualCommentForm ref="virtualCommentFormRef"/>
  </div>

</template>

<script>
import {getCommentBrandPage} from '@/api/mall/product/comment'
import { formatDate } from "@/utils/formatTime";
import { getDictDatas, DICT_TYPE } from "@/utils/dict";
import GGRightToolbar from "@/components/GGRightToolbar/src/main.vue";
import ReplyForm from "./replyForm.vue";
import VirtualCommentForm from "@/views/mall/product/comment/virtualCommentForm.vue";
export default {
  name: "ProductComment",
  components: {GGRightToolbar,ReplyForm,VirtualCommentForm},
  data() {
    return {
      list:[],
      total:0,
      searchParams:{
        pageNo: 1,
        pageSize: 5,
        userNickname: "",
        orderId: "",
        spuId: "",
        spuName:"",
        scores: "",
        replyStatus: "",
        createTime: [],
      },
      loading:false,
      isShowSearchForm: true,
      replyStatusOptions: getDictDatas(DICT_TYPE.COMMENT_REPLY_STATUS),
      scoreOptions: getDictDatas(DICT_TYPE.comment_product_score),
      commentId: null,
    };
  },
  methods: {
    showVirtualCommentForm() {
      this.$refs.virtualCommentFormRef.open();
    },
    showReplyForm(id) {
      this.$refs.replyFormRef.open();
      this.$refs.replyFormRef.commentForm.id = id;
    },
    reset(){
      this.searchParams = {
        pageNo: 1,
        pageSize: 5,
        userNickname: "",
        orderId: "",
        spuId: "",
        spuName:"",
        scores: "",
        replyStatus: "",
        createTime: [],
      };
      this.getList();
      this.searchParams.pageNo = 1;


    },
    search(){
      this.searchParams.pageNo = 1;
      this.getList();
    },

    handleFormatDate(row) {
      return formatDate(row.createTime);
    },
    handleSizeChange(pageSize) {
      this.searchParams.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(pageNo) {
      this.searchParams.pageNo = pageNo;
      this.getList();
    },
    async getList(){
      this.loading = true;
      const {data} = await getCommentBrandPage(this.searchParams);
      console.log(data)
      this.list = data.list;
      this.total = data.total;
      this.loading = false;
    },
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>

.sku-img {
  width: 50px;
  height: 50px;
}
.spu-name {
  width: 200px;
  margin: 0 10px;
  text-align: center;
}
.comment-tag {
  margin-right: 10px;
}

</style>
