import Vue from "vue";
let vm = new Vue()
// 成功的弹框
export let successMsg = (msg) => {
    vm.$message({
        message: msg,
        type: "success",
    });
}
// 失败的弹框
export let errorMsg = (msg) => {
    vm.$message({
        message: msg,
        type: "warning",
    });
}