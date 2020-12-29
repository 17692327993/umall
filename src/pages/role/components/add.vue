<template>
  <div>
    <el-dialog :title="info.isAdd?'添加角色':'编辑角色' " :visible.sync="info.isshow" @closed="cancel">
      <el-form>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="角色名称" label-width="100px">
            <el-input v-model="datas.rolename" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="角色权限" label-width="100px">
          <!-- default-expand-all 展开所有选项 -->
          <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <!-- 1正常2禁用   number类型 -->
          <el-switch v-model="datas.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { successMsg, errorMsg } from "../../../utils/alert";
import { reqMenuList, reqRoleAdd, reqGetOne,reqRoleUpdate } from "../../../utils/http";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["info", "list"],
  data() {
    return {
      // 数据
      datas: {
        rolename: "",
        menus: "",
        status: 1, //状态1正常2禁用---
      },
      // 树形下拉框的数据
      data: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
   computed: {
    ...mapGetters({
      userInfo: "userInfo"
    })
  },
  methods: {
     ...mapActions({
      changeUser: "changeUser"
    }),
    // 弹框取消
    cancel() {
      if (!this.info.isAdd) {
        // 如果是编辑，就清空数据
         // 让选中的菜单置空
          this.$refs.tree.setCheckedKeys([]);
          this.empty()
      }
      this.info.isshow = false;
    },
    // 清空数据
    empty() {
      this.datas = {
        rolename: "",
        menus: "",
        status: 1, //状态1正常2禁用
      };
    },
    // 点击添加
    add() {
      if (this.datas.rolename == "") {
        errorMsg("角色名称不能为空");
        return;
      }
      // 转化成后端要的数据
      this.datas.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleAdd(this.datas).then((res) => {
        if (res.data.code === 200) {
          // 让选中的菜单置空
          this.$refs.tree.setCheckedKeys([]);
          // 通知父组件刷新列表
          this.$emit("init");
          // 关闭弹框
          this.cancel();
          // 清空数据
          this.empty();
          successMsg(res.data.msg);
        }
      });
    },
    // 菜单列表
    initMenuList() {
      // 获取菜单列表
      reqMenuList().then((res) => {
        if (res.data.code === 200) {
          this.data = res.data.list;
        }
      });
    },
  //  获取一条数据
    getOne(id) {
      reqGetOne(id).then((res) => {
        if (res.data.code === 200) {
          let menus = JSON.parse(res.data.list.menus);
          this.$refs.tree.setCheckedKeys(menus);
         
          this.datas = res.data.list;
          // 因为没有id，所以需要手动赋值
           this.datas.id=id
        }
      });
    },
     //真正的编辑
    update() {
       // 转化成后端要的数据
      this.datas.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleUpdate(this.datas).then(res=>{
        if (res.data.code===200) {
          successMsg(res.data.msg);

           //如果修改的角色，是当前用户所属的角色，就需要退出登录，重新登录
          if (this.datas.id == this.userInfo.roleid) {
            this.changeUser({});
            this.$router.push("/login");
            return;
          }
          // 弹框关闭
          this.cancel();
          // 通知父组件，更新列表
          this.$emit("init")
        }
      })
    },
  },
  mounted() {
    this.initMenuList();
  },
};
</script>

<style scoped>

</style>