<template>
  <div>
    <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
      <el-table-column prop="id" label="角色编号" sortable width="180"></el-table-column>
      <el-table-column prop="rolename" label="角色名称" sortable width="180"></el-table-column>

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
  </div>
</template>

<script>
import { reqRoleDel } from "../../../utils/http";
import { successMsg } from "../../../utils/alert";
export default {
  props: ["list"],
  methods: {
    del(id) {
      reqRoleDel(id).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);
          // 通知父组件重新获取列表
          this.$emit("init");
        }
      });
    },
    // 编辑
    edit(id) {
      // 通知父组件，有人点击了编辑
      this.$emit("edit", id);
    },
  },
};
</script>

<style>
</style>