import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false
// 1.引入reset.css
import "./assets/css/reset.css";
// 2.vuex
import store from "./store"
// 3.数据交互，安装  配置代理 
// 4.过滤器
import "./filters/index";
// 5.引入公共组件
import "./components/index";
// 6.pages 路由组件
// 7.stylus--预处理器
// 8.element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);


new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})