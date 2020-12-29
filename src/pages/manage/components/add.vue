<template>
  <div>
    <el-dialog :title="info.isAdd?'添加管理员':'编辑管理员' " :visible.sync="info.isshow" @closed="cancel">
      <el-form>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="所属角色" label-width="100px">
            <el-select v-model="data.roleid">
              <el-option :value="0" label="所属角色"></el-option>
              <!-- 需要一段数据 -->
              <el-option
                v-for="item in rolelist"
                :key="item.id"
                :value="item.id"
                :label="item.rolename"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="用户名" label-width="100px">
            <el-input v-model="data.username" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <div class="redParent">
          <span class="red" v-if="info.isAdd">*</span>
          <el-form-item label="密码" label-width="100px">
            <el-input v-model="data.password" autocomplete="off" show-password clearable></el-input>
          </el-form-item>
          <i class="psd" v-if="!info.isAdd">留空则不更新</i>
        </div>

        <el-form-item label="状态" label-width="100px">
          <!-- 1正常2禁用   number类型 -->
          <el-switch v-model="data.status" :active-value="1" :inactive-value="2"></el-switch>
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
import { errorMsg, successMsg } from "../../../utils/alert";
import { reqManageUpdate } from "../../../utils/http";
import {
  reqManageAdd,
  reqRoleList,
  reqManageGetone,
} from "../../../utils/http";
export default {
  props: ["info"],
  data() {
    return {
      data: {
        roleid: 0, //角色编号 -number
        username: "", //管理员名称
        password: "", //密码
        status: 1, //状态  1正常2禁用 --number
      },
      rolelist: [], //角色列表
    };
  },
  methods: {
    cancel() {
      // 如果是编辑，就清空数据
      if (!this.info.isAdd) {
        // 点击了取消，重置按钮状态为添加
        this.info.isAdd = true;
        this.empty();
      }
      this.info.isshow = false;
    },
    empty() {
      this.data = {
        roleid: 0, //角色编号 -number
        username: "", //管理员名称
        password: "", //密码
        status: 1, //状态  1正常2禁用 --number
      };
    },
    // 添加
    add() {
      if (!this.data.roleid) {
        errorMsg("请选择所属角色");
        return;
      }
      if (!this.data.username) {
        errorMsg("请填写用户名");
        return;
      }
      if (!this.data.password) {
        errorMsg("请填写密码");
        return;
      }
      reqManageAdd(this.data).then((res) => {
        if (res.data.code == 200) {
          successMsg(res.data.msg);
          // 通知父组件，刷新列表
          this.$emit("init");
          // 弹框关闭
          this.cancel();
          // 清空数据
          this.empty();
        }
      });
    },
    // 获取一条数据
    getOne(uid) {
      reqManageGetone(uid).then((res) => {
        if (res.data.code === 200) {
          this.data = res.data.list;
          this.data.password = "";
        }
      });
    },
    // 真正的更新
    update() {
      reqManageUpdate(this.data).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);
         this.cancel();
        //  通知父组件刷新列表
        this.$emit("init")
        }
      });
    },
  },
  mounted() {
    // 获取角色列表
    reqRoleList().then((res) => {
      if (res.data.code === 200) {
        this.rolelist = res.data.list;
      }
    });
  },
};
</script>

<style scoped>
.psd {
  display: block;
  margin-left: 100px;
}
</style>