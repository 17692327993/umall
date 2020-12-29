import Vue from 'vue'
import Router from 'vue-router'
import store from "../store/index"
function chenckEnter(path,next){
  if(store.state.userInfo.menus_url.includes(path) ){
    next();
  }else{
    next("/")
  }
}
Vue.use(Router)
export let indexRoutes= [{
  path: "menu",
  name:"菜单管理",
  component: () => import("../pages/menu/menu.vue"),
  // 路由独享守卫
  beforeEnter(to,from,next){
    chenckEnter("/menu",next);
  }
},
{
  path: "role",
  name:"角色管理",
  component: () => import("../pages/role/role.vue"),
  // 路由独享守卫
  beforeEnter(to,from,next){
    chenckEnter("/role",next);
  }
},
{
  path: "manage",
  name:"管理员管理",
  component: () => import("../pages/manage/manage.vue"),
  // 路由独享守卫
  beforeEnter(to,from,next){
    chenckEnter("/manage",next);
  }
},
{
  path: "cate",
  name:"分类管理",
  component: () => import("../pages/cate/cate.vue"),
  // 路由独享守卫
  beforeEnter(to,from,next){
    chenckEnter("/cate",next);
  }
},
{
  path: "specs",
  name:"规格管理",
  component: () => import("../pages/specs/specs.vue"),
  // 路由独享守卫
  beforeEnter(to,from,next){
    chenckEnter("/specs",next);
  }
},
{
  path: "goods",
  name:"商品管理",
  component: () => import("../pages/goods/goods.vue"),
  // 路由独享守卫
  beforeEnter(to,from,next){
    chenckEnter("/goods",next);
  }
},
{
  path: "member",
  name:"会员管理",
  component: () => import("../pages/member/member.vue"),
  // 路由独享守卫
  beforeEnter(to,from,next){
    chenckEnter("/member",next);
  }
},
{
  path: "banner",
  name:"轮播图管理",
  component: () => import("../pages/banner/banner.vue"),
  // 路由独享守卫
  beforeEnter(to,from,next){
    chenckEnter("/banner",next);
  }
},
{
  path: "seckill",
  name:"秒杀管理",
  component: () => import("../pages/seckill/seckill.vue"),
  // 路由独享守卫
  beforeEnter(to,from,next){
    chenckEnter("/seckill",next);
  }
},
]

let router= new Router({
  routes: [
    {
      path: "/login",
      name:"登录",
      component: () => import("../pages/login/login.vue")
    },
    {
      path: "/",
      component: () => import("../pages/index/index.vue"),
      children: [
        {
          path: "",
          component: () => import("../pages/home/home.vue")
        },
        //12.恢复
        ...indexRoutes
      ]
    },
    {
      path:"*",
      redirect:"/login"
    }
  ]
})


/*
  路由全局前置守卫（登录拦截）
  注意：to和from 是一个路由信息 
  区别$route:路由信息，获取路由参数的 和$router 路由对象，跳转路由路径的 
*/
router.beforeEach((to, from, next) => {

  // 1.如果是去登录和注册页面，直接进入
  if (to.path === '/login') {
    next();
    return
  }
  //2.如果有登录状态就进入
  if (store.state.userInfo.id) {
    next();
    return;
  }
  // 3.如果没有登录状态，就去登录页面--next()里面写啥，就去哪里
  next("/login")
});
export default router;