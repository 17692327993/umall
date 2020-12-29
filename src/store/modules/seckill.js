import {reqSecKillList}  from "../../utils/http";
// 定义
let state={
    // 1.定义变量
    list:[]
}
let mutations={
    // 2.修改
    changeList(state,arr){
        state.list=arr;
    }
}
let getters={
    // 3.导出一下,定义哪个变量就导出哪个变量
    list(state){
        return state.list;
    }
}
let actions={
    // 做列表的请求  actions 中用context
    reqList(context){
        reqSecKillList().then(res=>{
           if(res.data.code==200){
               context.commit("changeList",res.data.list)
           } 
        })
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    //命名空间
    namespaced:true
    
}