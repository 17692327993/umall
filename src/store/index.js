import Vue from "vue"
import Vuex from "vuex"
import {state,getters,mutations} from "./mutations"
import {actions} from "./actions"
// 引入列表
import cate from "./modules/cate.js";
//引入规格
import specs from "./modules/specs"
// 引入商品
import goods from "./modules/goods"
//秒杀
import seckill from "./modules/seckill"
Vue.use(Vuex);


export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
    modules:{
        // 注册一下
        cate,
        specs,
        goods,
        seckill
    }
})