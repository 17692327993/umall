<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 引入列表 -->
    <v-list
      :list="list"
      :listCount="listCount"
      :size="size"
      @changeCurrPage="changeCurrPage($event)"
      @edit="edit($event)"
      @init="init"
    ></v-list>
    <!-- 添加 -->
    <v-add :info="info" @init="init" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./components/list.vue";
import vAdd from "./components/add.vue";
import { reqManageList, reqManageCount } from "../../utils/http";
export default {
  data() {
    return {
      // 初始化列表
      list: [],
      info: {
        // 弹框出现 true  消失false
        isshow: false,
        // 添加 true  编辑false
        isAdd: true,
      },
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
      // 并且告诉是添加按钮
      this.isAdd = true;
    },
    getListTotal() {
      // 获取数据总数
      reqManageCount().then((res) => {
        if (res.data.code === 200) {
          this.listCount = res.data.list[0].total;
        }
      });
    },
    // 获取列表
    getList() {
      reqManageList({ size: this.size, page: this.page }).then((res) => {
        if (res.data.code == 200) {
          /*
          如果删除了最后一页的最后一条，那么当前页就会取到空数组；
          这个时候如果有上一页的话，就应该取上一页
          */
          if (res.data.list.length == 0 && this.page > 1) {
            this.page--;
            this.getList();
            return;
          }
          this.list = res.data.list;
        }
      });
    },
    // 获取总数
    // 初始化列表
    init() {
      this.getListTotal();
      this.getList();
    },
    // 获取子组件的通知，修改当前页数
    changeCurrPage(curPage) {
      this.page = curPage;
      this.getList();
    },
    edit(uid) {
      // 弹框出现
      this.info.isshow = true;
      //  编辑
      this.info.isAdd = false;
      // 调用子组件的获取单条数据
      this.$refs.add.getOne(uid);
    },
  },
  mounted() {
    // 获取列表
    this.init();
  },
};
// bug删除后，列表刷新，分页数据不能及时更新
</script>

<style>
</style>