<template>
  <div>
    <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
      <el-table-column prop="id" label="管理员编号" sortable width="180"></el-table-column>
      <el-table-column prop="username" label="管理员名称" sortable width="180"></el-table-column>
      <el-table-column prop="rolename" label="所属角色" sortable width="180"></el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <!--status  1正常2禁用  -->
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="danger" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
          <v-del-btn @confirm="del(scope.row.uid)"></v-del-btn>
        </template>
      </el-table-column>
    </el-table>
    <!-- hide-on-single-page 只有第一页的时候隐藏 -->
    <el-pagination
      hide-on-single-page
      :page-size="size"
      :pager-count="5"
      layout="prev, pager, next"
      :total="listCount"
      @current-change="changeCurrent"
      @prev-click="changeCurrent"
      @next-click="changeCurrent"
    ></el-pagination>
  </div>
</template>

<script>
import { confirmDel, successMsg } from "../../../utils/alert";
import { reqManageDel } from "../../../utils/http";
export default {
  props: ["size", "listCount", "list"],
  data() {
    return {};
  },
  methods: {
    changeCurrent(e) {
      // 通知父组件，有人修改了当前页数--为多少页e
      this.$emit("changeCurrPage", e);
    },
    // 编辑
    edit(uid) {
      // 通知父组件，有人点击了编辑
      this.$emit("edit", uid);
    },
    del(uid) {
      reqManageDel(uid).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);
          // 通知父组件，刷新列表
          this.$emit("init");
        }
      });
    },
  },
};
</script>

<style>
</style>