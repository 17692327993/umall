<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 列表 -->
    <v-list  @edit="edit"  ></v-list>
    <v-add :info="info" ref="add"></v-add>
  </div>
</template>

<script>
import vAdd from "./components/add";
import vList from "./components/list";
export default {
  data() {
    return {
      info: {
        // 弹框出现  true  消失false
        isshow: false,
        // 按钮状态  添加true  编辑false
        isAdd: true,
      },
    };
  },
  components: {
    vList,
    vAdd,
  },
  methods: {
    willAdd() {
      // 弹框出现
      this.info.isshow = true;
    },
    edit(id) {
      // 弹框出现
      this.willAdd();
      // 点击的是编辑
      this.info.isAdd = false;
      // 调用子组件的方法
      this.$refs.add.getOne(id);
    },
  },
};
</script>

<style>
</style>