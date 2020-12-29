<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
    >
      <el-table-column prop="id" label="秒杀编号" sortable width="80"></el-table-column>
      <el-table-column prop="title" label="秒杀名称" sortable width="180"></el-table-column>

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
import { reqSecKillDel } from "../../../utils/http";
import { successMsg } from "../../../utils/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  methods: {
    ...mapActions({
      seckillList: "seckill/reqList",
    }),
    del(id) {
      reqSecKillDel({ id: id }).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);
          // 通知父组件刷新列表
          this.seckillList();
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
      list: "seckill/list",
    }),
  },
  mounted(){
    // 获取秒杀列表
    this.seckillList()
  }
};
</script>

<style scoped>
img {
  width: 80px;
  height: 80px;
}
</style>