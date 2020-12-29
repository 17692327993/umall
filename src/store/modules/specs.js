import { reqSpecsList, reqSpecsTotal } from "../../utils/http";

let state={
    list:[],
    listCount:0,//总数目
    page:1,//当前页数
    size:2,//每页显示条数
}
let mutations={
    changeList(state,arr){
        state.list=arr;
    },
    changePage(state,num){
        state.page=num
    },
    changelistCount(state,num){
        state.listCount=num
    },
}
let getters={
    // 导出
    list(state){
        return state.list;
    },
    size(state){
        return state.size;
    },
    listCount(state){
        return state.listCount;
    }
}
let actions={
    reqList(context,bool){
         //商品规格是要分页的，商品管理，是不要分页的。所以多给一个参数，bool.
        //bool是true,就要全部；否则，就做分页
        let params=bool?{}:{page:context.state.page,size:context.state.size}
        reqSpecsList(params).then(res=>{
            if(res.data.code==200){
                if(res.data.list.length==0&& context.state.page>1){
                    context.commit("changePage",context.state.page-1);
                    context.dispatch("reqList");
                    return;
                }
                 //处理列表逻辑
                 let list=res.data.list
                 list.forEach(item=>{
                     item.attrs=JSON.parse(item.attrs)
                 })
                context.commit("changeList",res.data.list)
            }
        })
    },
    // 获取总条目数
    reqListTotal(context){
        reqSpecsTotal().then(res=>{
            if(res.data.code==200){
                context.commit("changelistCount",res.data.list[0].total)
            }
        })
    },
    // 修改而当前页数
    changePage(context,num){
        // 通知mutations修改 
        context.commit("changePage",num);
        // 重新获取列表
        context.dispatch("reqList")
    }
}

export default{
    state,
    mutations,
    getters,
    actions,
    namespaced:true
}
