<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 列表 -->
    <v-list :list="list" @init="init" @edit="edit"></v-list>
    <v-add :list="list" :info="info" @init="init" ref="add"></v-add>
  </div>
</template>

<script>
import vAdd from "./components/add";
import vList from "./components/list";
import {reqBannerList} from "../../utils/http"
import {successMsg} from "../../utils/alert"
export default {
  data() {
    return {
      info: {
        // 弹框出现  true  消失false
        isshow: false,
        // 按钮状态  添加true  编辑false
        isAdd: true,
      },
      // 初始化列表
      list:[]
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
    // 列表
    init(){
      reqBannerList( {istree: true}).then(res=>{
        if (res.data.code===200) {
          this.list=res.data.list
        }
      })
    },
    edit(id){
      // 弹框出现
      this.willAdd();
      // 点击的是编辑
      this.info.isAdd=false;
      // 调用子组件的方法
    this.$refs.add.getOne(id);
    }
  },
  mounted(){
    // 获取列表数据
    this.init()
  }
};
</script>

<style>
</style>