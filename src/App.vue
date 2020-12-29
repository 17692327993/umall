<template>
  <div >
    <!-- 路由出口 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style >
.dialog-footer {
  text-align: center;
}
.redParent {
  position: relative;
}
.red {
  display: inline-block;
  position: absolute;
  left: 16px;
  top: 16px;
  color: red;
}
</style>