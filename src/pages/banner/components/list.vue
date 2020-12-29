<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="轮播图编号" sortable width="180"></el-table-column>
      <el-table-column prop="title" label="轮播图标题" sortable width="180"></el-table-column>
      <el-table-column prop="img" label="图片">
        <template slot-scope="scope">
        <img :src="$pre+scope.row.img" alt="">
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
  </div>
</template>

<script>
import { reqBannerDel } from "../../../utils/http";
import { successMsg } from "../../../utils/alert";
export default {
  props: ["list"],
  methods: {
    del(id) {
      reqBannerDel({id:id}).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);
          // 通知父组件刷新列表
          this.$emit("init");
        }
      });
    },
    edit(id) {
      // 通知父组件有人点击了编辑
      this.$emit("edit", id);
    },
  },
};
</script>

<style scoped>
img{
  width: 80px;
  height: 80px;
}
</style>