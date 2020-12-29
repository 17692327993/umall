<template>
  <div>
    <el-table :data="list" style="width: 100%;margin-bottom: 20px;" row-key="id" border>
      <el-table-column prop="id" label="会员编号" sortable width="180"></el-table-column>
      <el-table-column prop="nickname" label="昵称" sortable width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" sortable width="180"></el-table-column>

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
export default {
  props:["list","listCount","size","page"],
  methods:{
    // 修改当前页数
    changeCurrent(e){
      // 通知父组件，有人修改了当前页数--为多少页e
      this.$emit("changeCurrPage", e);
    },
    edit(uid){
      // 通知父组件有人点击了编辑
      this.$emit("edit",uid);
    }
  }
   

}
</script>

<style>

</style>