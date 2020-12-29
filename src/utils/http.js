import axios from "axios";
import qs from "qs";
import Vue from "vue";
import { errorMsg } from "../utils/alert";
import router from "../router/index"
import store from "../store/index"
// 开发环境使用8080
let baseUrl = "/api";
Vue.prototype.$pre = "http://localhost:3000/";

// 生产环境使用 打包
// let baseUrl="";
// Vue.prototype.$pre="";


// 请求拦截
axios.interceptors.request.use(req => {
    // console.log("请求拦截======");
    if (req.url !== baseUrl + "/api/userlogin") {
        req.headers.authorization =store.state.userInfo.token;
    }
    // console.log(req);
    return req
})


// 响应拦截
axios.interceptors.response.use(res => {
    
    //18.统一处理失败
    if (res.data.code !== 200) {
        errorMsg(res.data.msg)
    }
    // 统一处理，如果获取回来的列表为null，统一处理为[]
    if (!res.data.list) {
        res.data.list=[];
    }
    // console.group("本次请求的是：====" + res.config.url + "====");
    // console.log(res);
    // console.groupEnd();
    // 处理掉线状态，就要自动跳转到等页面
    if (res.data.msg == "登录已过期或访问权限受限") {
        // 清除状态层的userInfo
        store.dispatch("changeUser",{});
        router.push("/login")

    }
    return res;
})
// 封装图片上传处理  post 带有文件，参数转换
function dataToFormData(data){
    let newData=new FormData();
    for (let i in data) {
      newData.append(i,data[i])
    }
    return newData;
}


/********************登录 start **************************/
export let reqLogin = (data) => {
    return axios({
        url: baseUrl + "/api/userlogin",
        method: "post",
        data: qs.stringify(data)
    })
}
/********************登录  end  **************************/
/********************菜单管理 start**************************/
/*
    添加菜单--/api/menuadd
    methods：post
    user：{}
*/
export let reqMenuAdd = (user) => {
    return axios({
        url: baseUrl + "/api/menuadd",
        method: "post",
        data: qs.stringify(user)
    })
}
/*
    获取列表--/api/menulist
    method:get
    参数：istree  是否需要返回树形结构   是-true,  否：不传
*/
export let reqMenuList = () => {
    return axios({
        url: baseUrl + "/api/menulist",
        method: "get",
        params: {
            istree: true
        }
    })
}
/*
    删除菜单--/api/menudelete
    method:post
    参数：id 菜单编号
*/
export let reqMenuDel = (id) => {
    return axios({
        url: baseUrl + "/api/menudelete",
        method: "post",
        data: qs.stringify({ id })
    })
}
/*
    单条数据的菜单信息--/api/menuinfo
    method:get
    参数：id 菜单编号
*/
export let reqMenuDetail = (id) => {
    return axios({
        url: baseUrl + "/api/menuinfo",
        method: "get",
        params: { id }
    })
}
/*
    菜单修改--/api/menuedit
    method:post
    参数：data={}
*/
export let reqMenuUpdate = (data) => {
    return axios({
        url: baseUrl + "/api/menuedit",
        method: "post",
        data: qs.stringify(data)
    })
}
/********************菜单管理  end  *************************/


/********************角色管理 start  *************************/
/*
    获取角色列表
*/
export let reqRoleList = () => {
    return axios({
        url: baseUrl + "/api/rolelist",
        method: "get",

    })
}
/*
    添加角色
*/
export let reqRoleAdd = (data) => {
    return axios({
        url: baseUrl + "/api/roleadd",
        method: "post",
        data: qs.stringify(data)
    })
}
/*
    删除角色
*/
export let reqRoleDel = (id) => {
    return axios({
        url: baseUrl + "/api/roledelete",
        method: "post",
        data: qs.stringify({ id })
    })
}
/*
    获取角色的一条数据
*/
export let reqGetOne = (id) => {
    return axios({
        url: baseUrl + "/api/roleinfo",
        method: "get",
        params: { id }
    })
}
/*
    修改角色
*/
export let reqRoleUpdate = (data) => {
    return axios({
        url: baseUrl + "/api/roleedit",
        method: "post",
        data: qs.stringify(data)
    })
}

/********************角色管理  end   *************************/

/********************管理员管理  start   *************************/
/*
    管理员添加
*/
export let reqManageAdd = (data) => {
    return axios({
        url: baseUrl + "/api/useradd",
        method: "post",
        data: qs.stringify(data)
    })
}
/*
    管理员列表
*/
export let reqManageList = (data) => {
    return axios({
        url: baseUrl + "/api/userlist",
        method: "get",
        params: data
    })
}
/*
    管理员总数
*/
export let reqManageCount = () => {
    return axios({
        url: baseUrl + "/api/usercount",
        method: "get"
    })
}
/*
    管理员单条数据
*/
export let reqManageGetone = (uid) => {
    return axios({
        url: baseUrl + "/api/userinfo",
        method: "get",
        params: { uid }
    })
}
/*
    管理员修改
*/
export let reqManageUpdate = (data) => {
    return axios({
        url: baseUrl + "/api/useredit",
        method: "post",
        data: qs.stringify(data)
    })
}
/*
    管理员删除
*/
export let reqManageDel = (uid) => {
    return axios({
        url: baseUrl + "/api/userdelete",
        method: "post",
        data: qs.stringify({ uid })
    })
}


/********************管理员管理   end    *************************/

/********************分类管理   start    *************************/
/*
    添加分类
*/
export let reqCateAdd = (data) => {

    return axios({
        url: baseUrl + "/api/cateadd",
        method: "post",
        data: dataToFormData(data)
    })
}

/*
    分类列表
*/
export let reqCateList = (params) => {
    return axios({
        url: baseUrl + "/api/catelist",
        method: "get",
        params
    })
}
/*
    获取一条分类 
    params{id:id}
*/
export let reqCateDetail = (params) => {
    return axios({
        url: baseUrl + "/api/cateinfo",
        method: "get",
        params
    })
}

/*
    编辑分类
*/
export let reqCateEdit = (data) => {

    return axios({
        url: baseUrl + "/api/cateedit",
        method: "post",
        data: dataToFormData(data)
    })
} 
/*
    删除分类 
    params{id:id}
*/
export let reqCateDel = (data) => {
    return axios({
        url: baseUrl + "/api/catedelete",
        method: "post",
        data:qs.stringify(data)
    })
}

/********************分类管理    end     *************************/

/********************会员管理    start   *************************/
/*
    会员添加
*/
export let reqMemberAdd = (data) => {
    return axios({
        url: baseUrl + "/api/memberadd",
        method: "post",
        data:qs.stringify(data)
    })
}
/*
    会员列表
*/
export let reqMemberList = ({size,page}) => {
    return axios({
        url: baseUrl + "/api/memberlist",
        method: "get",
        params:{
            page:page,
            size:size
        }
    })
}
/*
    会员列表--总数
*/
export let reqMemberListTotal = () => {
    return axios({
        url: baseUrl + "/api/memberlist",
        method: "get",
    
    })
}

/*
    获取一条数据
*/ 
export let reqMemberGetOne=(uid)=>{
    return axios({
        url:baseUrl+"/api/memberinfo",
        method:"get",
        params:{uid}
    })
}
/*
    会员更新
*/ 
export let reqMemberUpdate=(data)=>{
    return axios({
        url:baseUrl+"/api/memberedit",
        method:"post",
        data:qs.stringify(data)
    })
}
/********************会员管理     end    *************************/

/********************规格管理     start  *************************/
/*
    添加商品规格
    data:{
        specsname       商品规格名称
        attrs           商品规格属性值
        status          状态1正常2禁用
    }
*/ 
export let reqSpecsAdd=(data)=>{
    return axios({
        url:baseUrl+"/api/specsadd",
        method:"post",
        data:qs.stringify(data)
    })
}
/*
    商品规格总数
*/ 
export let reqSpecsTotal=()=>{
    return axios({
        url:baseUrl+"/api/specscount",
    })
}
/*
    商品规格列表+分页
    params={
        page:1,
        size:1
    }
*/ 
export let reqSpecsList=(params)=>{
    return axios({
        url:baseUrl+"/api/specslist",
        method:"get",
        params
    })
}
/*
    商品规格获取（一条）
    params={
        id:"规格编号"
    }
*/ 
export let reqSpecsGetOne=(params)=>{
    return axios({
        url:baseUrl+"/api/specsinfo",
        method:"get",
        params
    })
}
/*
    编辑商品规格
    data:{
        id分类编号      必填项
        specsname       商品规格名称
        attrs           商品规格属性值
        status          状态1正常2禁用
    }
*/ 
export let reqSpecsEdit=(data)=>{
    return axios({
        url:baseUrl+"/api/specsedit",
        method:"post",
        data:qs.stringify(data)
    })
}
/*
   删除商品规格
    data:{
        id分类编号      必填项
    }
*/ 
export let reqSpecsDel=(data)=>{
    return axios({
        url:baseUrl+"/api/specsdelete",
        method:"post",
        data:qs.stringify(data)
    })
}

/********************规格管理     end    *************************/


/********************轮播图管理  start   *************************/
/*
    添加轮播图
*/ 
export let reqBannerAdd=(data)=>{
    return axios({
        url:baseUrl+"/api/banneradd",
        method:"post",
        data:dataToFormData(data)
    })
}
/*
    编辑轮播图
*/ 
export let reqBannerEdit=(data)=>{
    return axios({
        url:baseUrl+"/api/banneredit",
        method:"post",
        data:dataToFormData(data)
    })
}
/*
    获取一条数据 
    {id:轮播图编号}
*/ 
export let reqBannerGetOne=(params)=>{
    return axios({
        url:baseUrl+"/api/bannerinfo",
        method:"get",
        params
    })
}
/*
    轮播图列表 
*/ 
export let reqBannerList=()=>{
    return axios({
        url:baseUrl+"/api/bannerlist"
    })
}
/*
   删除轮播图
   data= {id:轮播图编号}
*/ 
export let reqBannerDel=(data)=>{
    return axios({
        url:baseUrl+"/api/bannerdelete",
        method:"post",
        data:qs.stringify(data)
    })
}
/********************轮播图管理   end    *************************/

/********************商品管理   start    *************************/
/*
    商品添加
*/ 

export let reqGoodsAdd=(data)=>{
    return axios({
        url:baseUrl+"/api/goodsadd",
        method:"post",
        data:dataToFormData(data)
    })
}
/*
    商品编辑
*/ 

export let reqGoodsEdit=(data)=>{
    return axios({
        url:baseUrl+"/api/goodsedit",
        method:"post",
        data:dataToFormData(data)
    })
}
/*
    商品总数
*/ 

export let reqGoodsTotal=()=>{
    return axios({
        url:baseUrl+"/api/goodscount",
    })
}
/*
    商品列表
    params={
        size    查询条数
        page    页码数
        fid     一级分类id
        sid     二级分类id
    }
*/ 

export let reqGoodsList=(params)=>{
    return axios({
        url:baseUrl+"/api/goodslist",
        method:"get",
        params
    })
}
/*
    商品获取（一条）
    params={
       id  :商品id
    }
*/ 

export let reqGoodsGetOne=(params)=>{
    return axios({
        url:baseUrl+"/api/goodsinfo",
        method:"get",
        params
    })
}
/*
    商品删除
    data={
       id  :商品id
    }
*/ 

export let reqGoodsDel=(data)=>{
    return axios({
        url:baseUrl+"/api/goodsdelete",
        method:"post",
        data:qs.stringify(data)
    })
}
/********************商品管理    end     *************************/

/********************秒杀管理   start    *************************/
/*
    秒杀添加
*/ 
export let reqSecKillAdd=(data)=>{
    return axios({
        url:baseUrl+"/api/seckadd",
        method:"post",
        data:qs.stringify(data)
    })
}
/*
    秒杀编辑
*/ 
export let reqSecKillEdit=(data)=>{
    return axios({
        url:baseUrl+"/api/seckedit",
        method:"post",
        data:qs.stringify(data)
    })
}
/*
    秒杀删除
    data={id:id}
*/ 
export let reqSecKillDel=(data)=>{
    return axios({
        url:baseUrl+"/api/seckdelete",
        method:"post",
        data:qs.stringify(data)
    })
}
/*
    秒杀列表
    data={id:id}
*/ 
export let reqSecKillList=()=>{
    return axios({
        url:baseUrl+"/api/secklist",
    })
}
/*
    限时秒杀获取（一条）
    params={id:id}
*/ 
export let reqSecKillGetOne=(params)=>{
    return axios({
        url:baseUrl+"/api/seckinfo",
        method:"get",
        params
    })
}

/********************秒杀管理    end     *************************/