<template>
  <div>
    <el-container class="menu">
      <!--
           

            2.v-if和v-for作用在同一个节点上，但是没有多余的节点，但是又是双层循环，
             v-if="i.status==1" 
            3.在菜单添加后，userinfo里面sessionStorage缓存的菜单，不能及时更新问题
      -->
      <el-aside width="200px">
        <!-- 
          default-active默认选中项
          unique-opened 始终保持一个窗口展开
           router启用路由模式
        -->
        <el-menu
          default-active="/"
          class="el-menu-vertical-demo"
          background-color="#20222A"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <div v-for="item in userInfo.menus" :key="item.id">
            <!-- 单纯是菜单 -->
            <el-menu-item v-if="!item.children" :index="item.url">{{item.title}}</el-menu-item>
            <!-- 有目录，有菜单 -->
            <el-submenu :index="item.id+''" v-if="item.children">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="i in item.children" :key="i.id" :index="i.url">{{i.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </div>

          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span>系统菜单</span>
            </template>

            <el-menu-item-group>
              <el-menu-item index="/menu">菜单管理</el-menu-item>
              <el-menu-item index="/role">角色管理</el-menu-item>
              <el-menu-item index="/manage">管理员管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
          <!-- <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-shopping-bag-2"></i>
              <span>商城管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/cate">商品分类</el-menu-item>
              <el-menu-item index="/specs">商品规格</el-menu-item>
              <el-menu-item index="/goods">商品管理</el-menu-item>
              <el-menu-item index="/member">会员管理</el-menu-item>
              <el-menu-item index="/banner">轮播图管理</el-menu-item>
              <el-menu-item index="/seckill">秒杀活动</el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="loginInfo">
            {{userInfo.username}}
            <el-button type="danger" @click="outLogin">退出</el-button>
          </div>
        </el-header>
        <el-main>
          <!-- 面包屑 -->
          <el-breadcrumb separator="/" v-if="$route.name">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 路由出口 -->
          <router-view class="mar20"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
    }),
    // 退出登录
    outLogin() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          // 清空对象
          this.changeUser({});
          this.$router.push("/login");
        })
        .catch((er) => {});
    },
  },
};
</script>

<style scoped>
.menu {
  height: 100vh;
}
.el-aside {
  background: #20222a;
}
.el-aside ul li {
  width: 200px;
}
.header {
  width: 100%;
  background: #b3c0d1;
}
.loginInfo {
  float: right;
  padding-right: 20px;
  line-height: 60px;
  font-size: 18px;
}
.mar20 {
  padding-top: 20px;
}
</style>