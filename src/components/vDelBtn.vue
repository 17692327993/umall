<template>
  <el-button type="danger" @click="del">删除</el-button>
</template>

<script>
export default {
  methods: {
    del() {
      // 确定删除的弹框
      this.$confirm("你确定删除吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(response=>{
             //用户点了确定，通知父组件该删了
           this.$emit("confirm")
        }).catch(err=>{})
    },
  },
};
</script>

<style>
</style>