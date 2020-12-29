<template>
  <div>
    <!-- <el-button type="primary" @click="willAdd">添加</el-button> -->
    <v-list
      :list="list"
      :listCount="listCount"
      :size="size"
      :page="page"
      @edit="edit($event)"
      @changeCurrPage="changeCurrPage($event)"
    ></v-list>
    <v-add :info="info" @init="init" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./components/list";
import vAdd from "./components/add";
import { reqMemberList, reqMemberListTotal } from "../../utils/http";
import { successMsg } from "../../utils/alert";
export default {
  data() {
    return {
      info: {
        // 弹框默认不显示
        isshow: false,
        // isAdd 添加true 编辑false
        isAdd: true,
      },
      // 初始化列表
      list: [],
      listCount: 1, //总数
      page: 1, // 设置初始页数--当前页数
      size: 2, //每页条数
    };
  },
  components: {
    vList,
    vAdd,
  },
  methods: {
    // 弹框出现
    willAdd() {
      this.info.isshow = true;
    },

    // 初始化列表
    init() {
      reqMemberList({ size: this.size, page: this.page }).then((res) => {
        if (res.data.code == 200) {
          this.list = res.data.list;
        }
      });
    },
    edit(uid) {
      // 弹框出现
      this.willAdd();
      // 按钮变成编辑
      this.info.isAdd = false;
      // 父组件调用add子组件的getOne();
      this.$refs.add.getOne(uid);
    },
    // 获取子组件的通知，修改当前页数
    changeCurrPage(curPage) {
      this.page = curPage;
      this.init();
    },
  },
  mounted() {
    //会员列表总数
    reqMemberListTotal().then((res) => {
      if (res.data.code == 200) {
        this.listCount = res.data.list.length;
      }
    });
    this.init();
    // 获取总数
  },
};
</script>

<style>
</style>