<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 引入列表 -->
    <v-list :list="list" @init="init" @edit="edit($event)"></v-list>
    <!-- 添加 -->
    <v-add :info="info" :list="list" @init="init" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./components/list.vue";
import vAdd from "./components/add.vue";
import {reqRoleList} from "../../utils/http";
import {successMsg} from "../../utils/alert";
export default {
  data(){
    return {
      list:[],
      info:{
        isshow:false,
        isAdd:true,//true添加 false修改
      },
      
    }
  },
  components: {
    vList,
    vAdd,
  },
  methods:{
    // 添加弹框显示
    willAdd(){
      this.info.isshow=true
      // 我点击的是添加按钮
      this.info.isAdd=true
    },
    // 初始化角色列表
    init(){
      reqRoleList().then(res=>{
        if (res.data.code==200) {
          this.list=res.data.list
        }
      })
    },
    //父组件接收子组件的编辑信息
    edit(id){
       this.info.isshow=true
      // 我点击的是编辑按钮
      this.info.isAdd=false;
      // 调用add组件的获取一条信息
      this.$refs.add.getOne(id)
    }
  },
  mounted(){
    // 获取角色列表
    this.init()
    
  }
};
</script>

<style>
</style>