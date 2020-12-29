<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 列表 -->
    <v-list :list="list" @init="init($event)" @edit="edit($event)"></v-list>
    <!-- 弹框 -->
    <v-add :list="list" :info="info" @init="init($event)" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./components/list";
import vAdd from "./components/add";
import { reqMenuList } from "../../utils/http";
import { successMsg } from "../../utils/alert";
export default {
  data() {
    return {
      info: {
        // 弹框状态
        isshow: false,
        // 添加、编辑按钮
        isAdd: true,
      },
      // 初始化列表
      list: [],
    };
  },
  components: {
    vList,
    vAdd,
  },
  methods: {
    // 让弹框出现
    willAdd() {
      this.info.isshow = true;
      // 是添加
      this.info.isAdd = true;
    },
    // 列表信息
    init() {
      reqMenuList().then((res) => {
        if (res.data.code === 200) {
          this.list = res.data.list;
        }
      });
    },
    // 编辑
    edit(id) {
      // 让弹框出现
      this.info.isshow = true;
      // 是编辑
      this.info.isAdd = false;
      // 触发add的getOne()
      this.$refs.add.getOne(id);
    },
  },
  mounted() {
    // 调用列表
    this.init();
  },
};
</script>

<style>
</style>