<template>
  <div>
    <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
      <el-table-column prop="id" label="规格编号" sortable width="180"></el-table-column>
      <el-table-column prop="specsname" label="规格名称" sortable width="180"></el-table-column>
      <el-table-column prop="attrs" label="规格属性" sortable width="180">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.attrs" :key="item">{{item}}</el-tag>
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
import { reqSpecsDel } from "../../../utils/http";
import { successMsg } from "../../../utils/alert";
import {mapActions,mapGetters} from "vuex";
export default {
  methods: {
    ...mapActions({
      "reqList":"specs/reqList",
      "changePage":"specs/changePage",
      "reqListTotal":"specs/reqListTotal",
    }),
    del(id) {
      reqSpecsDel({ id }).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);
          // 获取列表
          this.reqList();
          // 重新获取总数
          this.reqListTotal();
        }
      });
    },
    // 编辑
    edit(id) {
      // 通知父组件，有人点击了编辑
      this.$emit("edit", id);
    },
  },
  computed:{
    ...mapGetters({
      "list":"specs/list",
      "size":"specs/size",
      "listCount":"specs/listCount",
    })
  },
  mounted(){
    this.reqList();
    this.reqListTotal();
  }
};
</script>

<style>
</style>