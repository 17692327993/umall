<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="商品编号" sortable width="80"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称" sortable width="180"></el-table-column>
      <el-table-column prop="price" label="商品价格" sortable width="180"></el-table-column>
      <el-table-column prop="market_price" label="市场价格" sortable width="180"></el-table-column>
      <el-table-column prop="img" label="图片">
        <template slot-scope="scope">
          <img :src="$pre+scope.row.img" alt />
        </template>
      </el-table-column>

      <el-table-column label="是否新品">
        <template slot-scope="scope">
          <!--status  1正常2禁用  -->
          <el-button type="primary" v-if="scope.row.isnew==1">是</el-button>
          <el-button type="danger" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否热卖">
        <template slot-scope="scope">
          <!--status  1正常2禁用  -->
          <el-button type="primary" v-if="scope.row.ishot==1">是</el-button>
          <el-button type="danger" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <!--status  1正常2禁用  -->
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="danger" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <v-del-btn @confirm="del(scope.row.id)"></v-del-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- hide-on-single-page ：当只有一页的时候隐藏 -->
    <el-pagination
      background
      hide-on-single-page
      layout="prev, pager, next"
      :total="listCount"
      :page-size="size"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
import { reqGoodsDel } from "../../../utils/http";
import { successMsg } from "../../../utils/alert";
import { mapActions, mapGetters } from "vuex";
export default {
  methods: {
    ...mapActions({
      reqList: "goods/reqList",
      reqlistCount: "goods/reqlistCount",
      changePage: "goods/changePage",
    }),
    del(id) {
      reqGoodsDel({ id: id }).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);

          // 刷新列表
          this.reqlistCount();
          this.reqList();
        }
      });
    },
    edit(id) {
      // 通知父组件有人点击了编辑
      this.$emit("edit", id);
    },
  },
  computed: {
    ...mapGetters({
      list: "goods/list",
      listCount: "goods/listCount",
      size: "goods/size",
    }),
  },
  mounted() {
    this.reqlistCount();
    this.reqList();
  },
};
</script>

<style scoped>
img {
  width: 80px;
  height: 80px;
}
</style>