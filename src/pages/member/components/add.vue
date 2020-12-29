<template>
  <div>
    <el-dialog :title="info.isAdd?'添加会员':'编辑会员' " :visible.sync="info.isshow" @closed="cancel">
      <el-form>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="手机号" label-width="100px">
            <el-input v-model="data.phone" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="昵称" label-width="100px">
            <el-input v-model="data.nickname" autocomplete="off"></el-input>
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
import { reqMemberAdd,reqMemberGetOne,reqMemberUpdate  } from "../../../utils/http";

export default {
  props: ["info"],
  data() {
    return {
      data: {
        phone: "",
        nickname: "",
        password: "",
        status: 1,
      },
    };
  },
  methods: {
    //   弹框消失
    cancel() {
      //   如果是编辑，清空数据
      if (!this.info.isAdd) {
        this.empty();
        // 重新复制按钮状态
        this.info.isAdd=true
      }
      this.info.isshow = false;
    },
    //   清空数据
    empty() {
      this.data = {
        phone: "",
        nickname: "",
        password: "",
        status: 1,
      };
    },
    // 添加
    add() {
      if (!this.data.phone) {
        errorMsg("用户手机号不能为空");
        return
      }
      if (!this.data.nickname) {
        errorMsg("用户昵称不能为空");
        return
      }
      if (!this.data.password) {
        errorMsg("用户密码不能为空");
        return
      }
      reqMemberAdd(this.data).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);
          //   关闭弹窗
          this.cancel();
        //   清空数据
        this.empty();
        // 通知父组件刷新列表
        this.$emit("init");
        }
      });
    },
    // 获取一条数据
    getOne(uid){
      reqMemberGetOne(uid).then(res=>{
        if (res.data.code===200) {
          this.data=res.data.list;
          this.data.password='';
        }
      })
    },
    // 真正的编辑
    update() {
      reqMemberUpdate(this.data).then(res=>{
        if (res.data.code==200) {
          successMsg(res.data.msg);
          this.cancel();
          this.$emit("init");
          this.empty();
        }
      })
    },
  },
};
</script>

<style scoped>
.psd {
  display: block;
  margin-left: 100px;
}
</style>