<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="分类编号" sortable width="180"></el-table-column>
      <el-table-column prop="catename" label="分类名称" sortable width="180"></el-table-column>
      <el-table-column prop="img" label="图片">
        <template slot-scope="scope">
        <img v-if="scope.row.pid!=0" :src="$pre+scope.row.img" alt="">
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
import { reqCateDel } from "../../../utils/http";
import { successMsg } from "../../../utils/alert";
import {mapActions,mapGetters} from "vuex";
export default {
  methods: {
    del(id) {
      reqCateDel({id:id}).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);
          // 刷新列表
           this.reqList();
        }
      });
    },
    edit(id) {
      // 通知父组件有人点击了编辑
      this.$emit("edit", id);
    },
     ...mapActions({
      "reqList":"cate/reqList"
    })
  },
  computed:{
    ...mapGetters({
      "list":"cate/list"
    })
  },
  mounted(){
    this.reqList()
  }
};
</script>

<style scoped>
img{
  width: 80px;
  height: 80px;
}
</style>